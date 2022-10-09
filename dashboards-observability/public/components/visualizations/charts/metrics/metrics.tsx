/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { EuiFlexItem, EuiFlexGroup } from '@elastic/eui';
import React from 'react';
import { sum, min, max, meanBy } from 'lodash';
import { EmptyPlaceholder } from '../../../event_analytics/explorer/visualizations/shared_components/empty_placeholder';
import './metrics.scss';

export const Metrics = ({ visualizations }: any) => {
  const {
    data,
    metadata: { fields },
  } = visualizations.data.rawVizData;

  const { dataConfig = {}, layoutConfig = {} } = visualizations.data.userConfigs;
  const dataTitle = dataConfig?.panelOptions?.title;

  const getSelectedColorTheme = (field: any, index: number) =>
    (dataConfig?.colorTheme?.length > 0 &&
      dataConfig.colorTheme.find((colorSelected) => colorSelected.name.name === field)?.color) ||
    '#000';
  const fontSize = dataConfig?.fontSize?.fontSize ? dataConfig.fontSize.fontSize : 48;

  const calculateAggregateValue = (aggregate: string, label: string) => {
    switch (aggregate) {
      case 'COUNT':
        return data[label].length;
      case 'AVERAGE':
        return meanBy(data[label]).toFixed(2);
      case 'MAX':
        return (max(data[label]) as number).toFixed(2);
      case 'MIN':
        return (min(data[label]) as number).toFixed(2);
      case 'SUM':
        return sum(data[label]).toFixed(2);
    }
  };

  return (
    <div className="metricsContainer">
      <h4 className="metricTitle"> {dataTitle} </h4>
      <div>
        {dataConfig && dataConfig?.series?.length > 0 ? (
          dataConfig.series.map((metric, index: number) => {
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
                      <div className="aggregateValue" style={{ fontSize: fontSize + 'px' }}>
                        {calculateAggregateValue(aggFunction.label, metric.label)}
                      </div>
                      <div className="aggregateLabel" style={{ fontSize: fontSize / 2 + 'px' }}>
                        <span> {aggFunction.label} </span>
                        {metric.alias !== '' ? metric.alias : metric.label}
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
