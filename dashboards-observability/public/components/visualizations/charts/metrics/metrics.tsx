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
  const dataConfigTab =
    visualizations.data?.rawVizData?.metrics?.dataConfig &&
    visualizations.data.rawVizData.metrics.dataConfig;
  const dataTitle = dataConfig?.panelOptions?.title;

  const getSelectedColorTheme = (field: any, index: number) =>
  (dataConfig?.colorTheme?.length > 0 &&
    dataConfig.colorTheme.find((colorSelected) => colorSelected.name.name === field)
      ?.color) ||  '#000';

		const calculateAggregateValue = (aggregate: string, label: string) => {
    if (aggregate === 'COUNT') {
      return data[label].length;
    } else if (aggregate === 'AVERAGE') {
      return meanBy(data[label]).toFixed(2);
    } else if (aggregate === 'MAX') {
      return (max(data[label]) as number).toFixed(2);
    } else if (aggregate === 'MIN') {
      return (min(data[label]) as number).toFixed(2);
    } else if (aggregate === 'SUM') {
      return sum(data[label]).toFixed(2);
    }
  };

  return (
      
    
    <div className="metricsContainer">
    <h4 className="metricTitle"> {dataTitle} </h4>
      <div>
        {dataConfigTab && dataConfigTab.metrics.length > 0 ? (
          dataConfigTab.metrics.map((metric, index) => {
            return (
              
              <EuiFlexGroup
                justifyContent="spaceAround"
                alignItems="center"
                className="metricValueContainer"
                style={{color: getSelectedColorTheme(metric.label, index)}}
              >
                {metric.aggregation.length !== 0 &&
                  metric.label !== '' &&
                  metric.aggregation.map((aggFunction) => (
                    <EuiFlexItem grow={false} className="metricValue">
                      <div className="aggregateValue" style={{fontSize: dataConfig?.FontSize?.fontsize+'px'}}>
                        {calculateAggregateValue(aggFunction.label, metric.label)}
                      </div>
                      <div className="aggregateLabel" style={{fontSize: dataConfig?.FontSize?.fontsize / 2+'px'}}>
                       {aggFunction.label} {metric.custom_label !== '' ? metric.custom_label : metric.label}
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
  )
};
