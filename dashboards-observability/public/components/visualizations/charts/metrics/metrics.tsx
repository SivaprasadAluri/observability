/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { EuiFlexItem, EuiFlexGroup } from '@elastic/eui';
import React from 'react';
import { sum, min, max, meanBy } from 'lodash';
import { EmptyPlaceholder } from '../../../event_analytics/explorer/visualizations/shared_components/empty_placeholder';
import './metrics.scss';
import { IVisualizationContainerProps } from '../../../../../common/types/explorer';
import { AGGREGATIONS, GROUPBY } from '../../../../../common/constants/explorer';

export const Metrics = ({ visualizations }: any) => {
  const {
    data: {
      rawVizData: {
        data: queriedVizData,
        metadata: { fields },
      },
      userConfigs,
    },
    vis: visMetaData,
  }: IVisualizationContainerProps = visualizations;

  const {
    dataConfig: {
      colorTheme = [],
      fontSize = {},
      panelOptions = {},
      [GROUPBY]: dimensions = [],
      [AGGREGATIONS]: series = [],
    },
    layoutConfig = {},
  } = userConfigs;

  const dataTitle = panelOptions?.title;
  const getSelectedColorTheme = (field: any, index: number) =>
    (colorTheme?.length > 0 &&
      colorTheme.find((colorSelected) => colorSelected.name.name === field)?.color) ||
    '#000';
  const metricFontSize = fontSize?.fontSize ? fontSize.fontSize : 48;

  const calculateAggregateValue = (aggregate: string, label: string) => {
    switch (aggregate) {
      case 'COUNT':
        return queriedVizData[label].length;
      case 'AVERAGE':
        return meanBy(queriedVizData[label]).toFixed(2);
      case 'MAX':
        return (max(queriedVizData[label]) as number).toFixed(2);
      case 'MIN':
        return (min(queriedVizData[label]) as number).toFixed(2);
      case 'SUM':
        return sum(queriedVizData[label]).toFixed(2);
    }
  };

  return (
    <div className="metricsContainer">
      <h4 className="metricTitle"> {dataTitle} </h4>
      <div>
        {series && series?.length > 0 ? (
          series.map((metric, index: number) => {
            return (
              <EuiFlexGroup
                justifyContent="spaceAround"
                alignItems="center"
                className="metricValueContainer"
                style={{ color: getSelectedColorTheme(metric.label, index) }}
                key={index}
              >
                {metric.aggregation.length !== 0 &&
                  metric.aggregation.map((aggFunction, i: number) => (
                    <EuiFlexItem grow={false} className="metricValue" key={i}>
                      <div className="aggregateValue" style={{ fontSize: metricFontSize + 'px' }}>
                        {calculateAggregateValue(aggFunction.label, metric.label)}
                      </div>
                      <div
                        className="aggregateLabel"
                        style={{ fontSize: metricFontSize / 2 + 'px' }}
                      >
                        <span> {aggFunction.label} </span>
                        {metric.custom_label !== '' ? metric.custom_label : metric.label}
                      </div>
                    </EuiFlexItem>
                  ))}
              </EuiFlexGroup>
            );
          })
        ) : (
          <EmptyPlaceholder icon={visualizations?.vis?.icontype} />
        )}
      </div>
    </div>
  );
};
