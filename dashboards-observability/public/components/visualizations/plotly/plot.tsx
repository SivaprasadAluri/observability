/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import plotComponentFactory from 'react-plotly.js/factory';
import Plotly from 'plotly.js-dist';
import { uiSettingsService } from '../../../../common/utils';
import { Annotations } from '../annotations/annotations';

interface PltProps {
  data: Plotly.Data[];
  layout?: Partial<Plotly.Layout>;
  config?: Partial<Plotly.Config>;
  onHoverHandler?: (event: Readonly<Plotly.PlotMouseEvent>) => void;
  onUnhoverHandler?: (event: Readonly<Plotly.PlotMouseEvent>) => void;
  onClickHandler?: (event: Readonly<Plotly.PlotMouseEvent>) => void;
  onAnnotationClickHandler?: (event: Readonly<Plotly.PlotMouseEvent>) => void;
  height?: string;
  dispatch?: (props: any) => void;
  showAnnotationInput?: boolean;
  onChangeHandler?: Function;
  onAddAnnotationHandler?: Function;
  onCancelAnnotationHandler?: Function;
}

export function Plt(props: PltProps) {
  const PlotComponent = plotComponentFactory(Plotly);
  const darkLayout = uiSettingsService.get('theme:darkMode')
    ? {
        paper_bgcolor: '#1D1E24',
        plot_bgcolor: '#1D1E24',
        font: {
          color: '#DFE5EF',
        },
      }
    : {};

  const finalLayout = {
    autosize: true,
    margin: {
      l: 30,
      r: 5,
      b: 30,
      t: 5,
      pad: 4,
    },
    barmode: 'stack',
    legend: {
      orientation: 'h',
      traceorder: 'normal',
    },
    showlegend: false,
    hovermode: 'closest',
    xaxis: {
      showgrid: true,
      zeroline: false,
      rangemode: 'normal',
      automargin: true,
    },
    yaxis: {
      showgrid: true,
      zeroline: false,
      rangemode: 'normal',
    },
    ...darkLayout,
    ...props.layout,
  };

  const finalConfig = {
    displayModeBar: false,
    ...props.config,
  };

  return (
    <div>
      <Annotations
        showInputBox={props.showAnnotationInput!}
        onTextChange={props.onChangeHandler!}
        onAddAnnotation={props.onAddAnnotationHandler!}
        onCancelAnnotation={props.onCancelAnnotationHandler!}
      />
      <PlotComponent
        divId="explorerPlotComponent"
        data={props.data}
        style={{ width: '100%', height: props.height || '100%' }}
        onHover={props.onHoverHandler}
        onUnhover={props.onUnhoverHandler}
        onClick={props.onClickHandler}
        onClickAnnotation={props.onAnnotationClickHandler}
        useResizeHandler
        config={finalConfig}
        layout={finalLayout}
      />
    </div>
  );
}
 