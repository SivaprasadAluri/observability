/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="cypress" />
import {
  delay,
  TEST_QUERIES,
  querySearch,
  landOnEventVisualizations,
  saveVisualizationAndVerify,
  deleteVisualization,
} from '../../utils/event_constants';

const numberOfWindow = 2;

const renderHeatMapChart = () => {
  landOnEventVisualizations();
  querySearch(TEST_QUERIES[4].query, TEST_QUERIES[4].dateRangeDOM);
  cy.get('[aria-label="config chart selector"] [data-test-subj="comboBoxInput"]')
    .type('Heatmap')
    .type('{enter}');
};

const renderDataForHeateMap = () => {
  cy.get('[data-test-subj="comboBoxInput"]').eq(0).click();
  cy.get('.euiComboBoxOption__content').contains('avg').click();
  cy.get('[data-test-subj="comboBoxInput"]').eq(1).click();
  cy.get('.euiComboBoxOption__content').contains('bytes').click();
  cy.get('[data-test-subj="comboBoxInput"]').eq(2).click();
  cy.get('.euiComboBoxOption__content').contains('host').click();
  cy.get('[data-test-subj="comboBoxInput"]').eq(3).click();
  cy.get('.euiComboBoxOption__content').contains('bytes').click();
  cy.get('.euiFieldNumber').eq(0).type('1');
  cy.get('.euiButton__text').contains('Update chart').click();
  cy.get('.plot-container.plotly').should('exist');
};

describe('Render Heatmap and verify default behaviour ', () => {
  beforeEach(() => {
    renderHeatMapChart();
  });

  it('Render Heatmap and verify by default the data dont gets render', () => {
    cy.get('.plot-container.plotly').should('not.exist');
    cy.get('.euiTextColor.euiTextColor--subdued').contains('No results found').should('exist');
  });

  it('Render Heatmap and verify data configuration panel and chart panel', () => {
    cy.get('.euiPanel.euiPanel--paddingSmall').should('have.length', numberOfWindow);
    cy.get('.euiTitle.euiTitle--xxsmall').contains('Configuration').should('exist');
    cy.get('.euiTitle.euiTitle--xxsmall').contains('Dimensions').should('exist');
    cy.get('.euiTitle.euiTitle--xxsmall').contains('Series').should('exist');
    cy.get('.euiIEFlexWrapFix').contains('Panel options').should('exist');
    cy.get('.euiIEFlexWrapFix').contains('Chart styles').should('exist');
    cy.get('.euiForm.visEditorSidebar__form .euiIEFlexWrapFix')
      .contains('Tooltip options')
      .should('exist');
  });
});

describe('Render Heatmap chart for data configuration panel', () => {
  beforeEach(() => {
    renderHeatMapChart();
  });

  it('Render Heatmap and verify data config panel', () => {
    cy.get('[data-test-subj="comboBoxInput"]').eq(0).should('exist');
    cy.get('[data-test-subj="comboBoxInput"]').eq(1).should('exist');
    cy.get('[data-test-subj="comboBoxInput"]').eq(2).should('exist');
    cy.get('[data-test-subj="comboBoxInput"]').eq(3).should('exist');
    cy.get('.euiFieldNumber').eq(0).should('exist');
  });

  it('Render Heatmap and verify data gets render only after selecting the field value in data configuration panel', () => {
    renderDataForHeateMap();
  });
});

describe('Render Heatmap for panel options', () => {
  beforeEach(() => {
    renderHeatMapChart();
    renderDataForHeateMap();
  });

  it('Render Heatmap and verify the title gets updated according to user input ', () => {
    cy.get('input[name="title"]').type('Heatmap');
    cy.get('textarea[name="description"]').should('exist').click();
    cy.get('.gtitle').contains('Heatmap').should('exist');
  });

  it('Options under Tooltip options section', () => {
    cy.get('.euiIEFlexWrapFix').contains('Tooltip options').should('exist');
    cy.get('[data-text="Show"]').eq(1).contains('Show').should('exist');
    cy.get('[data-text="Hidden"]').eq(1).contains('Hidden').should('exist');
    cy.get('.euiTitle.euiTitle--xxsmall').contains('Tooltip text');
    cy.get('[data-text="All"]').contains('All').should('exist');
    cy.get('[data-text="Dim 1"]').contains('Dim 1').should('exist');
    cy.get('[data-text="Dim 2"]').contains('Dim 2').should('exist');
    cy.get('[data-text="Metrics"]').contains('Metrics').should('exist');
  });

  it('Options under Legend section', () => {
    cy.get('[data-text="Show"]').eq(0).contains('Show').should('exist');
    cy.get('[data-text="Hidden"]').eq(0).contains('Hidden').should('exist');
  });
});
