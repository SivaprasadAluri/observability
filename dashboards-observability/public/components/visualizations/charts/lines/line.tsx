/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { take, isEmpty, last } from 'lodash';
import { Plt } from '../../plotly/plot';
import { AvailabilityUnitType } from '../../../event_analytics/explorer/visualizations/config_panel/config_panes/config_controls/config_availability';
import { ThresholdUnitType } from '../../../event_analytics/explorer/visualizations/config_panel/config_panes/config_controls/config_thresholds';
import {
  DefaultChartStyles,
  FILLOPACITY_DIV_FACTOR,
  PLOTLY_COLOR,
} from '../../../../../common/constants/shared';
import { hexToRgb } from '../../../../components/event_analytics/utils/utils';
import { EmptyPlaceholder } from '../../../event_analytics/explorer/visualizations/shared_components/empty_placeholder';
import { Annotations } from '../../annotations/annotations';

export const Line = ({ visualizations, layout, config }: any) => {
  const {
    DefaultMode,
    Interpolation,
    LineWidth,
    FillOpacity,
    MarkerSize,
    LegendPosition,
    ShowLegend,
    LabelAngle,
  } = DefaultChartStyles;
  const {
    data = {},
    metadata: { fields },
  } = visualizations.data.rawVizData;
  const { defaultAxes } = visualizations.data;

  const [xAnnotation, setXAnnotation] = useState<string>('');
  const [yAnnotation, setYAnnotation] = useState<string>('');
  const [annotationText, setAnnotationText] = useState<string[]>(
    Array(visualizations.data.rawVizData.size).fill('')
  );
  const [annotationIndex, setAnnotationIndex] = useState(0);
  const [showInputBox, setShowInputBox] = useState<boolean>(false);

  const {
    dataConfig = {},
    layoutConfig = {},
    availabilityConfig = {},
  } = visualizations?.data?.userConfigs;

  const dataConfigTab =
    visualizations.data?.rawVizData?.line?.dataConfig &&
    visualizations.data.rawVizData.line.dataConfig;
  const xaxis = dataConfigTab?.dimensions
    ? dataConfigTab?.dimensions.filter((item) => item.label)
    : [];
  const yaxis = dataConfigTab?.metrics ? dataConfigTab?.metrics.filter((item) => item.label) : [];

  const lastIndex = fields.length - 1;

  const mode = dataConfig?.chartStyles?.style || DefaultMode;
  const lineShape = dataConfig?.chartStyles?.interpolation || Interpolation;
  const lineWidth = dataConfig?.chartStyles?.lineWidth || LineWidth;
  const showLegend = !(
    dataConfig?.legend?.showLegend && dataConfig.legend.showLegend !== ShowLegend
  );
  const legendPosition = dataConfig?.legend?.position || LegendPosition;
  const markerSize = dataConfig?.chartStyles?.pointSize || MarkerSize;
  const fillOpacity =
    dataConfig?.chartStyles?.fillOpacity !== undefined
      ? dataConfig?.chartStyles?.fillOpacity / FILLOPACITY_DIV_FACTOR
      : FillOpacity / FILLOPACITY_DIV_FACTOR;
  const tickAngle = dataConfig?.chartStyles?.rotateLabels || LabelAngle;
  const labelSize = dataConfig?.chartStyles?.labelSize;
  const legendSize = dataConfig?.legend?.legendSize;

  const getSelectedColorTheme = (field: any, index: number) =>
    (dataConfig?.colorTheme?.length > 0 &&
      dataConfig.colorTheme.find((colorSelected) => colorSelected.name.name === field.name)
        ?.color) ||
    PLOTLY_COLOR[index % PLOTLY_COLOR.length];

  if (isEmpty(xaxis) || isEmpty(yaxis))
    return <EmptyPlaceholder icon={visualizations?.vis?.iconType} />;

  let valueSeries;
  if (!isEmpty(xaxis) && !isEmpty(yaxis)) {
    valueSeries = [...yaxis];
  } else {
    valueSeries = (
      defaultAxes.yaxis || take(fields, lastIndex > 0 ? lastIndex : 1)
    ).map((item, i) => ({ ...item, side: i === 0 ? 'left' : 'right' }));
  }

  const isDimensionTimestamp = isEmpty(xaxis)
    ? defaultAxes?.xaxis?.length && defaultAxes.xaxis[0].type === 'timestamp'
    : xaxis.length === 1 && xaxis[0].type === 'timestamp';

  let multiMetrics = {};
  const isBarMode = mode === 'bar';
  let calculatedLineValues = valueSeries.map((field: any, index: number) => {
    const selectedColor = getSelectedColorTheme(field, index);
    const fillColor = hexToRgb(selectedColor, fillOpacity);
    const barMarker = {
      color: fillColor,
      line: {
        color: selectedColor,
        width: lineWidth,
      },
    };
    const fillProperty = {
      fill: 'tozeroy',
      fillcolor: fillColor,
    };
    const multiYaxis = { yaxis: `y${index + 1}` };
    multiMetrics = {
      ...multiMetrics,
      [`yaxis${index > 0 ? index + 1 : ''}`]: {
        titlefont: {
          color: selectedColor,
        },
        tickfont: {
          color: selectedColor,
          ...(labelSize && {
            size: labelSize,
          }),
        },
        overlaying: 'y',
        side: field.side,
      },
    };

    return {
      x: data[!isEmpty(xaxis) ? xaxis[0]?.label : fields[lastIndex].name],
      y: data[field.label],
      type: isBarMode ? 'bar' : 'scatter',
      name: field.label,
      mode,
      ...(!['bar', 'markers'].includes(mode) && fillProperty),
      line: {
        shape: lineShape,
        width: lineWidth,
        color: selectedColor,
      },
      marker: {
        size: markerSize,
        ...(isBarMode && barMarker),
      },
      ...(index >= 1 && multiYaxis),
    };
  });

  let layoutForBarMode = {
    barmode: 'group',
  };
  const mergedLayout = {
    ...layout,
    ...layoutConfig.layout,
    title: dataConfig?.panelOptions?.title || layoutConfig.layout?.title || '',
    legend: {
      ...layout.legend,
      orientation: legendPosition,
      ...(legendSize && {
        font: {
          size: legendSize,
        },
      }),
    },
    xaxis: {
      tickangle: tickAngle,
      automargin: true,
      tickfont: {
        ...(labelSize && {
          size: labelSize,
        }),
      },
    },
    annotations: [
      {
        x: xAnnotation,
        y: yAnnotation,
        xref: 'x',
        yref: 'y',
        text: annotationText[annotationIndex],
        showarrow: true,
        clicktoshow: 'onoff',
                visible: false
      },
    ],
    showlegend: showLegend,
    ...(isBarMode && layoutForBarMode),
    ...(multiMetrics && multiMetrics),
  };

  if (dataConfig.thresholds || availabilityConfig.level) {
    const thresholdTraces = {
      x: [],
      y: [],
      mode: 'text',
      text: [],
    };
    const thresholds = dataConfig.thresholds ? dataConfig.thresholds : [];
    const levels = availabilityConfig.level ? availabilityConfig.level : [];

    const mapToLine = (list: ThresholdUnitType[] | AvailabilityUnitType[], lineStyle: any) => {
      return list.map((thr: ThresholdUnitType) => {
        thresholdTraces.x.push(
          data[!isEmpty(xaxis) ? xaxis[xaxis.length - 1]?.label : fields[lastIndex].name][0]
        );
        thresholdTraces.y.push(thr.value * (1 + 0.06));
        thresholdTraces.text.push(thr.name);
        return {
          type: 'line',
          x0: data[!isEmpty(xaxis) ? xaxis[0]?.label : fields[lastIndex].name][0],
          y0: thr.value,
          x1: last(data[!isEmpty(xaxis) ? xaxis[0]?.label : fields[lastIndex].name]),
          y1: thr.value,
          name: thr.name || '',
          opacity: 0.7,
          line: {
            color: thr.color,
            width: 3,
            ...lineStyle,
          },
        };
      });
    };

    mergedLayout.shapes = [...mapToLine(thresholds, { dash: 'dashdot' }), ...mapToLine(levels, {})];
    calculatedLineValues = [...calculatedLineValues, thresholdTraces];
  }

  const mergedConfigs = {
    ...config,
    ...(layoutConfig.config && layoutConfig.config),
  };

  const onLineChartClick = () => {
    var myPlot = document.getElementById('explorerPlotComponent');
    myPlot?.on('plotly_click', function (data) {
      for (var i = 0; i < data.points.length; i++) {
        setXAnnotation('' + data.points[i].x);
        setYAnnotation('' + parseFloat(data.points[i].y.toPrecision(4)));
        setAnnotationIndex(data.points[i].pointIndex);
      }
      setShowInputBox(true);
    });
  };

  let newAnnotationText = '';
  const handleChange = (event: any) => {
    newAnnotationText = event.target.value;
  };

  const handleAddAnnotation = () => {
    const newAnnotation = [
      ...annotationText.slice(0, annotationIndex),
      newAnnotationText,
      ...annotationText.slice(annotationIndex + 1),
    ];
    setAnnotationText(newAnnotation);
    setShowInputBox(false);
  };

  return isDimensionTimestamp ? (
    <Plt
      data={calculatedLineValues}
      layout={mergedLayout}
      config={mergedConfigs}
      onClickHandler={onLineChartClick}
      showAnnotationInput={showInputBox}
      onChangeHandler={handleChange}
      onAddAnnotationHandler={handleAddAnnotation}
    />
  ) : (
    <EmptyPlaceholder icon={visualizations?.vis?.iconType} />
  );
};
