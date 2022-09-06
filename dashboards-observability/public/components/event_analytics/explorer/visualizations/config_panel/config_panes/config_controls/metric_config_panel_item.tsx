/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useContext } from 'react';
import {
  EuiTitle,
  EuiComboBox,
  EuiSpacer,
  EuiButton,
  EuiFieldText,
  EuiFlexItem,
  EuiFormRow,
  EuiIcon,
  EuiPanel,
  EuiText,
} from '@elastic/eui';
import { useDispatch, useSelector } from 'react-redux';
import {
  render as renderExplorerVis,
  selectExplorerVisualization,
} from '../../../../../../event_analytics/redux/slices/visualization_slice';
import {
  METRICS_AGGREGATION_OPTIONS,
  numericalTypes,
} from '../../../../../../../../common/constants/explorer';
import { visChartTypes } from '../../../../../../../../common/constants/shared';
import { MetricList, MetricListEntry } from '../../../../../../../../common/types/explorer';
import { TabContext } from '../../../../../hooks';

export const MetricConfigPanelItem = ({ fieldOptionList, visualizations }: any) => {
  const dispatch = useDispatch();
  const { tabId } = useContext<any>(TabContext);
  const explorerVisualizations = useSelector(selectExplorerVisualization)[tabId];
  const { data } = visualizations;

  const { data: vizData = {}, metadata: { fields = [] } = {} } = data?.rawVizData;

  const initialConfigEntry: MetricListEntry = {
    label: '',
    aggregation: [],
    custom_label: '',
    name: '',
  };

  const [configList, setConfigList] = useState<MetricList>({
    metrics: [initialConfigEntry],
  });

  useEffect(() => {
    if (
      data.rawVizData?.[visualizations.vis.name] &&
      data.rawVizData?.[visualizations.vis.name].dataConfig
    ) {
      setConfigList({
        ...data.rawVizData[visualizations.vis.name].dataConfig,
      });
    }
  }, [
    data.defaultAxes,
    data.rawVizData?.[visualizations.vis.name]?.dataConfig,
    visualizations.vis.name,
  ]);

  const updateList = (value: string, index: number, name: string, field: string) => {
    const listItem = { ...configList[name][index], [field]: value };

    const updatedList = {
      ...configList,
      [name]: [
        ...configList[name].slice(0, index),
        listItem,
        ...configList[name].slice(index + 1, configList[name].length),
      ],
    };
    setConfigList(updatedList);
  };

  const updateListWithAgg = (value: string[], index: number, name: string, field: string) => {
    const updatedList = {
      ...configList,
      [name]: [
        ...configList[name].slice(0, index),
        {
          ...configList[name][index],
          [field]: [...value],
        },
        ...configList[name].slice(index + 1, configList[name].length),
      ],
    };
    setConfigList(updatedList);
  };

  const handleServiceRemove = (index: number, name: string) => {
    const arr = [...configList[name]];
    arr.splice(index, 1);
    const updatedList = { ...configList, [name]: arr };
    setConfigList(updatedList);
  };

  const handleServiceAdd = (name: string) => {
    const updatedList = { ...configList, [name]: [...configList[name], initialConfigEntry] };
    setConfigList(updatedList);
  };

  const updateChart = () => {
    dispatch(
      renderExplorerVis({
        tabId,
        data: {
          ...explorerVisualizations,
          [visualizations.vis.name]: {
            dataConfig: {
              metrics: configList.metrics,
            },
          },
        },
      })
    );
  };

  const getOptionsAvailable = (sectionName: string) => {
    const selectedFields = {};
    for (const key in configList) {
      configList[key] && configList[key].forEach((field) => (selectedFields[field.label] = true));
    }

    return fieldOptionList.filter(
      (field) => !selectedFields[field.label] && numericalTypes.includes(field.type)
    );
  };

  const getCommonUI = (lists, sectionName: string) =>
    lists &&
    lists.map((singleField, index: number) => (
      <React.Fragment key={index}>
        <div className="services">
          <div className="first-division">
            <EuiPanel color="subdued" style={{ padding: '0px' }}>
              <EuiFormRow
                label="Aggregation"
                labelAppend={
                  lists.length !== 1 && (
                    <EuiText size="xs">
                      <EuiIcon
                        type="cross"
                        color="danger"
                        onClick={() => handleServiceRemove(index, sectionName)}
                      />
                    </EuiText>
                  )
                }
              >
                <EuiComboBox
                  aria-label="Selects a aggregation Field"
                  placeholder="Select a aggregation"
                  singleSelection={false}
                  options={METRICS_AGGREGATION_OPTIONS}
                  selectedOptions={
                    singleField.aggregation.length > 0 ? singleField.aggregation : []
                  }
                  onChange={(e) =>
                    updateListWithAgg(e.length > 0 ? e : '', index, sectionName, 'aggregation')
                  }
                />
              </EuiFormRow>
              <EuiFormRow label="Field">
                <EuiComboBox
                  aria-label="Selects a metric field"
                  placeholder="Select a field"
                  singleSelection={{ asPlainText: true }}
                  options={getOptionsAvailable(sectionName)}
                  selectedOptions={singleField.label ? [{ label: singleField.label }] : []}
                  onChange={(e) =>
                    updateList(e.length > 0 ? e[0].label : '', index, sectionName, 'label')
                  }
                />
              </EuiFormRow>

              <EuiFormRow label="Custom label">
                <EuiFieldText
                  placeholder="Custom label"
                  value={singleField.custom_label}
                  onChange={(e) => updateList(e.target.value, index, sectionName, 'custom_label')}
                  aria-label="Adds a Custom Label for metrics field"
                />
              </EuiFormRow>

              <EuiSpacer size="s" />
              {visualizations.vis.name !== visChartTypes.HeatMap && lists.length - 1 === index && (
                <EuiFlexItem grow>
                  <EuiButton
                    fullWidth
                    iconType="plusInCircleFilled"
                    color="primary"
                    onClick={() => handleServiceAdd(sectionName)}
                  >
                    Add
                  </EuiButton>
                </EuiFlexItem>
              )}
            </EuiPanel>
          </div>
        </div>
        <EuiSpacer size="s" />
      </React.Fragment>
    ));

  return (
    <React.Fragment>
      <EuiTitle size="xxs">
        <h3>Data Configurations</h3>
      </EuiTitle>
      <EuiSpacer size="s" />
      <EuiSpacer size="s" />
      <EuiTitle size="xxs">
        <h3>Metrics</h3>
      </EuiTitle>
      {getCommonUI(configList.metrics, 'metrics')}
      <EuiFlexItem grow={false}>
        <EuiButton
          data-test-subj="visualizeEditorRenderButton"
          iconType="play"
          onClick={updateChart}
          size="s"
        >
          Update chart
        </EuiButton>
      </EuiFlexItem>
    </React.Fragment>
  );
};
