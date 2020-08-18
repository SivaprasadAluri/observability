import React, { useState } from 'react'
import { EuiPopover, EuiButtonIcon, EuiContextMenu, EuiButtonEmpty, EuiPopoverTitle, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiSuperSelect, EuiSpacer, EuiButton } from '@elastic/eui';
import { EuiIcon } from '@elastic/eui';
import { EuiComboBoxOptionOption } from '@elastic/eui';
import { EuiComboBox } from '@elastic/eui';
import { EuiFieldNumber } from '@elastic/eui';
import { EuiBadge } from '@elastic/eui';
import { EuiText } from '@elastic/eui';

export interface FilterType {
  field: string;
  operator: string;
  value: any;
  inverted: boolean;
  disabled: boolean;
}

export function Filters() {
  const [filters, setFilters] = useState<FilterType[]>([{field: 'test'},{field:'test2'}]);
  const popoverPanels = [
    {
      id: 0,
      title: 'Change all filters',
      items: [
        {
          name: 'Invert inclusion',
          icon: <EuiIcon type="invert" size="m" />,
          onClick: () => {
            window.alert('click');
          },
        },
        {
          name: 'Remove all',
          icon: <EuiIcon type="trash" size="m" />,
          onClick: () => {
            window.alert('click');
          },
        },
      ],
    },
  ];
  const fieldOptions = [
    {
      label: 'Titan',
    },
    {
      label: 'Titan2',
    },
    {
      label: 'Titan3',
    },
  ]
  const operatorOptions = [
    {
      label: 'Titan',
    },
    {
      label: 'Titan2',
    },
    {
      label: 'Titan3',
    },
  ]


  const renderFilterPopover = () => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    return (
      <EuiPopover
        isOpen={isPopoverOpen}
        closePopover={() => setIsPopoverOpen(false)}
        button={
          <EuiButtonIcon
            onClick={() => setIsPopoverOpen(true)}
            iconType="filter"
            title="Change all filters"
          />
        }
        anchorPosition="rightUp"
        panelPaddingSize="none"
        withTitle
      >
        <EuiContextMenu initialPanelId={0} panels={popoverPanels} />
      </EuiPopover>
    );
  };

  const renderAddFilter = () => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [selectedFieldOptions, setSelectedFieldOptions] = useState<Array<EuiComboBoxOptionOption<string>>>([]);
    const [selectedOperatorOptions, setSelectedOperatorOptions] = useState<Array<EuiComboBoxOptionOption<string>>>([]);
    const button = (
      <EuiButtonEmpty
        size="xs"
        onClick={() => {
          setIsPopoverOpen(true);
        }}
      >
        + Add filter
      </EuiButtonEmpty>
    );

    const closePopover = () => {
      setIsPopoverOpen(false);
      setSelectedFieldOptions([]);
      setSelectedOperatorOptions([]);
    }

    return (
      <EuiPopover
        button={button}
        isOpen={isPopoverOpen}
        closePopover={closePopover}
        anchorPosition="downLeft"
        withTitle
      >
        <EuiPopoverTitle>{'Add filter'}</EuiPopoverTitle>
        <div style={{ width: 370 }}>
          <EuiFlexGroup gutterSize="s">
            <EuiFlexItem grow={6}>
              <EuiFormRow label={'Field'}>
                <EuiComboBox
                  placeholder='Select a field first'
                  isClearable={false}
                  options={fieldOptions}
                  selectedOptions={selectedFieldOptions}
                  onChange={(e) => setSelectedFieldOptions(e)}
                  singleSelection={{ asPlainText: true }}
                />
              </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem grow={5}>
              <EuiFormRow label={'Operator'}>
                <EuiComboBox
                  placeholder={selectedFieldOptions.length === 0 ? 'Waiting' : 'Select'}
                  isClearable={false}
                  isDisabled={selectedFieldOptions.length === 0}
                  options={operatorOptions}
                  selectedOptions={selectedOperatorOptions}
                  onChange={(e) => setSelectedOperatorOptions(e)}
                  singleSelection={{ asPlainText: true }}
                />
              </EuiFormRow>
            </EuiFlexItem>
          </EuiFlexGroup>
          {selectedOperatorOptions.length > 0 ? (
            <>
              <EuiSpacer size="s" />
              <EuiFormRow label={'Value'}>
                <EuiFieldNumber
                  placeholder="Placeholder text"
                  onChange={() => { }}
                />
              </EuiFormRow>
            </>
          ) : (null)}
          <EuiSpacer size="m" />
          <EuiFlexGroup gutterSize="s" justifyContent="flexEnd">
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty onClick={closePopover}>Cancel</EuiButtonEmpty>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButton fill onClick={closePopover}>Save</EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </div>
      </EuiPopover>
    );
  };

  const renderFilters = () => {
    const renderFilter = (filter, i) => {
      const [isPopoverOpen, setIsPopoverOpen] = useState(false);
      const badge = (
        <EuiBadge onClick={() => setIsPopoverOpen(true)} onClickAriaLabel='Open filter settings' color="hollow" iconType="cross" iconSide="right">{`${filter.field}`}</EuiBadge>
      )
      return (
        <EuiFlexItem grow={false} key={`filter-${i}`}>
          <EuiPopover
            button={badge}
            isOpen={isPopoverOpen}
            closePopover={() => setIsPopoverOpen(false)}>
            <EuiText>hello</EuiText>
          </EuiPopover>
        </EuiFlexItem>
      )
    }

    return (
      <>
        {filters.map((filter, i) => renderFilter(filter, i))}
      </>
    )
  }

  return (
    <EuiFlexGroup gutterSize="xs" alignItems="center" responsive={false}>
      <EuiFlexItem grow={false}>
        {renderFilterPopover()}
      </EuiFlexItem>
      {renderFilters()}
      <EuiFlexItem grow={false}>
        {renderAddFilter()}
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}