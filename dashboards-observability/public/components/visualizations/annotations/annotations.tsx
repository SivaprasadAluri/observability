import { EuiButton, EuiButtonEmpty, EuiFieldText, EuiTextArea } from '@elastic/eui';
import React, { useState, useContext } from 'react';

interface AnnotationProps {
  showInputBox: boolean;
  onTextChange: Function;
  onAddAnnotation: Function;
  onCancelAnnotation: Function;
}

export const Annotations: React.FC<AnnotationProps> = (props) => {
  // const annotationData = React.useContext(annotationContextText);

    
  const handleAddAnnotation = () => {
    props.onAddAnnotation();
  };

  const cancelAnnotation = () => {
    props.onCancelAnnotation();
  };

  const handleEditAnnotation = () => {
    props.onCancelAnnotation();
  };

  const handleDeleteAnnotation = () => {};

  return props.showInputBox ? (
    <div style={{ display:'flex', justifyContent: 'center'}}>


    <EuiFieldText
      name="name"
      placeholder="Add annotations"
      onChange={(e) => props.onTextChange(e)}
      style={{ padding: '5px' }}
    />
    <EuiButton 
        fill
        type="submit"
        onClick={handleAddAnnotation}
        color='primary'
        style={{
          margin:'0px 5px 0px 5px'
        }}>
        Save
      </EuiButton>
      <EuiButton
        fill
        type="submit"
        color='text'
        onClick={cancelAnnotation}>
        Cancel
      </EuiButton>
</div>
      
  ) : null;
};
