import React from "react";
import { DateInput, SelectInput, LongTextInput, TextInput, DisabledInput } from "react-admin";
import moment from "moment";

import { withStyles } from '@material-ui/core/styles';

import formStyles from "../../../config/formStyles";
import { routesArray } from "./selects";
import FormGroup from "@material-ui/core/FormGroup";
import {relationshipArray} from "../../Contacts/fragments/selects";

import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Downshift from 'downshift';
import { Field } from 'redux-form';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import axios from "axios";

/**
 * This component returns fields for Medications creation/editing forms
 *
 * @author Bogdan Shcherban <bsc@piogroup.net>
 * @param {shape} classes
 * @param {shape} rest
 */

const suggestions = [];
 const genericSuggestions = [];
 const brandSuggestions = [];

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        ...InputProps,
      }}
      {...other}
    />
  );
}

renderInput.propTypes = {
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object.isRequired,
  InputProps: PropTypes.object,
};

function renderSuggestion(suggestionProps) {
  const { suggestion, index, itemProps, highlightedIndex, selectedItem } = suggestionProps;
  const isHighlighted = highlightedIndex === index;
  const isSelected = (itemToStrings(selectedItem) || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.value}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}

renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.number]).isRequired,
  index: PropTypes.number.isRequired,
  itemProps: PropTypes.object.isRequired,
  suggestion: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
  }).isRequired
};

function performSearch(value) {
  var apiUrl = "https://cpcr01.tcd.ie/snomedapi/api/v1/medication_catalog/search/elastic/imf_vtm";
  var url = apiUrl + "/" + value;

  if (value !== "") {
    axios.get(url, {
      headers: {
        Authorization: "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lZGljYXRpb25fY2F0YWxvZ0B0ZXN0LmNvbSIsIl9pZCI6IjVkOGIzMTA2N2VhNDBjNTM2NDQ4MTY1OCIsImlhdCI6MTU2OTQ4ODQ0NywiZXhwIjoxNjAxMDI0NDQ3fQ.nzvZ999pcagZbp2OfzrIWqS8fDkxeYm3rYsefO4YZDI"
      }
    }) //paracetamol venlafaxine bupropion
    .then(function (response) {
      if (response.data.hits !== undefined) {
        var searchResults = response.data.hits.hits.map(function (element) {
          return {
            label: element._source.NM.toString(),
            value: element._id
          };
        }); //console.log(searchResults);

        suggestions = searchResults; //setSuggestions(searchResults);
        //console.log(suggestions);
      }
    }).catch(function (error) {
      return error;
    });
  }
}

function performSearchGeneric(value) {
  var apiUrl = "https://cpcr01.tcd.ie/snomedapi/api/v1/medication_catalog/search/elastic/imf_vmp";
  var url = apiUrl + "/" + value;

  if (value !== "") {
    axios.get(url, {
      headers: {
        Authorization: "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lZGljYXRpb25fY2F0YWxvZ0B0ZXN0LmNvbSIsIl9pZCI6IjVkOGIzMTA2N2VhNDBjNTM2NDQ4MTY1OCIsImlhdCI6MTU2OTQ4ODQ0NywiZXhwIjoxNjAxMDI0NDQ3fQ.nzvZ999pcagZbp2OfzrIWqS8fDkxeYm3rYsefO4YZDI"
      }
    }) //paracetamol venlafaxine bupropion
    .then(function (response) {
      if (response.data.hits !== undefined) {
        var searchResults = response.data.hits.hits.map(function (element) {
          return {
            label: element._source.NM.toString(),
            value: element._id
          };
        }); //console.log(searchResults);

        genericSuggestions = searchResults; //setSuggestions(searchResults);
        //console.log(genericSuggestions);
      }
    }).catch(function (error) {
      return error;
    });
  }
}

function performSearchBrand(value) {
  var apiUrl = "https://cpcr01.tcd.ie/snomedapi/api/v1/medication_catalog/search/elastic/imf_amp";
  var url = apiUrl + "/" + value;

  if (value !== "") {
    axios.get(url, {
      headers: {
        Authorization: "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lZGljYXRpb25fY2F0YWxvZ0B0ZXN0LmNvbSIsIl9pZCI6IjVkOGIzMTA2N2VhNDBjNTM2NDQ4MTY1OCIsImlhdCI6MTU2OTQ4ODQ0NywiZXhwIjoxNjAxMDI0NDQ3fQ.nzvZ999pcagZbp2OfzrIWqS8fDkxeYm3rYsefO4YZDI"
      }
    }) //paracetamol venlafaxine bupropion
    .then(function (response) {
      if (response.data.hits !== undefined) {
        var searchResults = response.data.hits.hits.map(function (element) {
          return {
            label: element._source.NM.toString(),
            value: element._id
          };
        }); //console.log(searchResults);

        brandSuggestions = searchResults; //setSuggestions(searchResults);
        //console.log(genericSuggestions);
      }
    }).catch(function (error) {
      return error;
    });
  }
}

function performVTMIDSearch(value) {
  var apiUrl = "https://cpcr01.tcd.ie/snomedapi/api/v1//medication_catalog/search/elastic/imf_vmp/vtm_id";
  var url = apiUrl + "/" + value;

  if (value !== "") {
    axios.get(url, {
      headers: {
        Authorization: "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lZGljYXRpb25fY2F0YWxvZ0B0ZXN0LmNvbSIsIl9pZCI6IjVkOGIzMTA2N2VhNDBjNTM2NDQ4MTY1OCIsImlhdCI6MTU2OTQ4ODQ0NywiZXhwIjoxNjAxMDI0NDQ3fQ.nzvZ999pcagZbp2OfzrIWqS8fDkxeYm3rYsefO4YZDI"
      }
    }) //paracetamol venlafaxine bupropion
    .then(function (response) {
      if (response.data.hits !== undefined) {
        var searchResults = response.data.hits.hits.map(function (element) {
          return {
            label: element._source.NM.toString(),
            value: element._id
          };
        }); //console.log(searchResults);

        genericSuggestions = searchResults; //setSuggestions(searchResults);

        console.log(genericSuggestions);
      }
    }).catch(function (error) {
      return error;
    });
  }
}

function performVMPIDSearch(value) {
  var apiUrl = "https://cpcr01.tcd.ie/snomedapi/api/v1//medication_catalog/search/elastic/imf_amp/vmp_id";
  var url = apiUrl + "/" + value;

  if (value !== "") {
    axios.get(url, {
      headers: {
        Authorization: "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lZGljYXRpb25fY2F0YWxvZ0B0ZXN0LmNvbSIsIl9pZCI6IjVkOGIzMTA2N2VhNDBjNTM2NDQ4MTY1OCIsImlhdCI6MTU2OTQ4ODQ0NywiZXhwIjoxNjAxMDI0NDQ3fQ.nzvZ999pcagZbp2OfzrIWqS8fDkxeYm3rYsefO4YZDI"
      }
    }) //paracetamol venlafaxine bupropion
    .then(function (response) {
      if (response.data.hits !== undefined) {
        var searchResults = response.data.hits.hits.map(function (element) {
          return {
            label: element._source.NM.toString(),
            value: element._id
          };
        }); //console.log(searchResults);

        brandSuggestions = searchResults; //setSuggestions(searchResults);

        console.log(brandSuggestions);
      }
    }).catch(function (error) {
      return error;
    });
  }
}

function getSuggestions(value, { showEmpty = false } = {}) {

  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  performSearch(value);

  return inputLength === 0 && !showEmpty
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

function getSuggestionsGeneric(value, { showEmpty = false } = {}) {

  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  if (suggestions.length == 0) {
    performSearchGeneric(value);
  }

  return inputLength === 0 && !showEmpty
    ? []
    : genericSuggestions.filter(suggestion => {
        const keep =
          count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

function getSuggestionsBrand(value, { showEmpty = false } = {}) {

  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  if (suggestions.length == 0 && genericSuggestions.length == 0) {
    performSearchBrand(value);
  }

  return inputLength === 0 && !showEmpty
    ? []
    : brandSuggestions.filter(suggestion => {
        const keep =
          count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

function itemToStrings(i) {
  return i ? i.label : "";
}

 const renderTextField = ({ classes, input, label, meta: { touched, error }, ...custom }) => (
   <Downshift id="downshift-simple" {...input} 
	onSelect={selection =>
      //alert(selection ? `You selected ${selection.value}` : 'Selection Cleared')
	performVTMIDSearch(selection.value)
    }
    itemToString={item => (item ? item.label : '')}>
       {({
         getInputProps,
         getItemProps,
         getLabelProps,
         getMenuProps,
         highlightedIndex,
         inputValue,
         isOpen,
         selectedItem,
       }) => {
         const { onBlur, onFocus, ...inputProps } = getInputProps({
           placeholder: 'Search for a Generic Medication',
         });

         return (
           <div>
             {renderInput({
               fullWidth: true,
               label: 'Generic',
               InputLabelProps: getLabelProps({ shrink: true }),
               InputProps: { onBlur, onFocus, disableUnderline: true },
               inputProps,
             })}

             <div {...getMenuProps()}>
               {isOpen ? (
                 <Paper square>
                   {getSuggestions(inputValue).map((suggestion, index) =>
                     renderSuggestion({
                       suggestion,
                       index,
                       itemProps: getItemProps({ key: suggestion.value, item: suggestion, disableUnderline: true }),
                       highlightedIndex,
                       selectedItem,
                     }),
                   )}
                 </Paper>
               ) : null}
             </div>
           </div>
         );
       }}
     </Downshift>
 );

 const renderTextFieldGeneric = ({ classes, input, label, meta: { touched, error }, ...custom }) => (
   <Downshift id="downshift-simple" {...input} onSelect={selection =>
      //alert(selection ? `You selected ${selection.value}` : 'Selection Cleared')
	performVMPIDSearch(selection.value)
    }
    itemToString={item => (item ? item.label : '')}>
       {({
         getInputProps,
         getItemProps,
         getLabelProps,
         getMenuProps,
         highlightedIndex,
         inputValue,
         isOpen,
         selectedItem,
       }) => {
         const { onBlur, onFocus, ...inputProps } = getInputProps({
           placeholder: 'Search for a Generic Formula Medication',
         });

         return (
           <div>
             {renderInput({
               fullWidth: true,
               label: 'Generic Formula',
               InputLabelProps: getLabelProps({ shrink: true }),
               InputProps: { onBlur, onFocus, disableUnderline: true },
               inputProps,
             })}

             <div {...getMenuProps()}>
               {isOpen ? (
                 <Paper square>
                   {getSuggestionsGeneric(inputValue).map((suggestion, index) =>
                     renderSuggestion({
                       suggestion,
                       index,
                       itemProps: getItemProps({ key: suggestion.value, item: suggestion, disableUnderline: true }),
                       highlightedIndex,
                       selectedItem,
                     }),
                   )}
                 </Paper>
               ) : null}
             </div>
           </div>
         );
       }}
     </Downshift>
 );

 const renderTextFieldBrand = ({ classes, input, label, meta: { touched, error }, ...custom }) => (
   <Downshift id="downshift-simple" {...input} itemToString={item => (item ? item.label : '')}>
       {({
         getInputProps,
         getItemProps,
         getLabelProps,
         getMenuProps,
         highlightedIndex,
         inputValue,
         isOpen,
         selectedItem,
       }) => {
         const { onBlur, onFocus, ...inputProps } = getInputProps({
           placeholder: 'Search for a Brand Medication',
         });

         return (
           <div>
             {renderInput({
               fullWidth: true,
               label: 'Brand',
               InputLabelProps: getLabelProps({ shrink: true }),
               InputProps: { onBlur, onFocus, disableUnderline: true },
               inputProps,
             })}

             <div {...getMenuProps()}>
               {isOpen ? (
                 <Paper square>
                   {getSuggestionsBrand(inputValue).map((suggestion, index) =>
                     renderSuggestion({
                       suggestion,
                       index,
                       itemProps: getItemProps({ key:suggestion.value, item: suggestion, disableUnderline: true }),
                       highlightedIndex,
                       selectedItem,
                     }),
                   )}
                 </Paper>
               ) : null}
             </div>
           </div>
         );
       }}
     </Downshift>
 );

const MedicationsInput = ({ classes, ...rest }) => (
    <span>
        <Field name="name"  component={renderTextField}/>
    </span>
);

const GenericFormulaInput = ({ classes, ...rest }) => (
    <span>
        <Field name="medicationGeneric"  component={renderTextFieldGeneric}/>
    </span>
);

const BrandFormulaInput = ({ classes, ...rest }) => (
    <span>
        <Field name="medicationBrand"  component={renderTextFieldBrand}/>
    </span>
);

const MedicationsInputs = ({ classes, ...rest }) => (
    <React.Fragment>

	<FormGroup className={classes.formGroup}>
      	    <MedicationsInput
                InputProps={{ disableUnderline: true, classes: { root: classes.customRoot, input: classes.customInput } }}
                InputLabelProps={{ shrink: true, className: classes.customFormLabel }}
             />
        </FormGroup>

        <FormGroup className={classes.formGroup}>
      	    <GenericFormulaInput
                InputProps={{ disableUnderline: true, classes: { root: classes.customRoot, input: classes.customInput } }}
                InputLabelProps={{ shrink: true, className: classes.customFormLabel }}
             />
        </FormGroup>

        <FormGroup className={classes.formGroup}>
      	    <BrandFormulaInput
                InputProps={{ disableUnderline: true, classes: { root: classes.customRoot, input: classes.customInput } }}
                InputLabelProps={{ shrink: true, className: classes.customFormLabel }}
             />
        </FormGroup>

        <FormGroup className={classes.formGroup}>
            <SelectInput
                source="route"
                label="Route"
                choices={routesArray}
                fullWidth
                InputProps={{ disableUnderline: true, classes: { root: classes.customRoot, input: classes.customSelector } }}
                InputLabelProps={{ shrink: true, className: classes.customFormLabel }}
            />
        </FormGroup>

        <FormGroup className={classes.formGroup}>
            <LongTextInput
                source="doseAmount"
                label="Dose Amount"
                rows={20}
                fullWidth
                InputProps={{ disableUnderline: true, classes: { root: classes.customRoot, input: classes.customTextarea } }}
                InputLabelProps={{ shrink: true, className: classes.customFormLabel }}
            />
        </FormGroup>

        <FormGroup className={classes.formGroup}>
            <LongTextInput
                source="doseDirections"
                label="Dose Description"
                rows={20}
                fullWidth
                InputProps={{ disableUnderline: true, classes: { root: classes.customRoot, input: classes.customTextarea } }}
                InputLabelProps={{ shrink: true, className: classes.customFormLabel }}
            />
        </FormGroup>

        <FormGroup className={classes.formGroup}>
            <LongTextInput
                source="doseTiming"
                label="Dose Timing"
                rows={20}
                fullWidth
                InputProps={{ disableUnderline: true, classes: { root: classes.customRoot, input: classes.customTextarea } }}
                InputLabelProps={{ shrink: true, className: classes.customFormLabel }}
            />
        </FormGroup>

        <FormGroup className={classes.formGroup}>
            <TextInput
                source="medicationCode"
                label="Medication Description"
                fullWidth
                InputProps={{ disableUnderline: true, classes: { root: classes.customRoot, input: classes.customInput } }}
                InputLabelProps={{ shrink: true, className: classes.customFormLabel }}
            />
        </FormGroup>

        <FormGroup className={classes.formGroup}>
            <DateInput
                source="startDate"
                label="Start date"
                fullWidth
                InputProps={{ disableUnderline: true, classes: { root: classes.customRoot, input: classes.customInput } }}
                InputLabelProps={{ shrink: true, className: classes.customFormLabel }}
            />
        </FormGroup>

        <FormGroup className={classes.formGroup}>
            <TextInput
                source="author"
                label="Author"
                fullWidth
                defaultValue={localStorage.getItem('username')}
                disabled={true}
                InputProps={{ disableUnderline: true, classes: { root: classes.customRoot, input: classes.customInput } }}
                InputLabelProps={{ shrink: true, className: classes.customFormLabel }}
            />
        </FormGroup>

        <FormGroup className={classes.formGroup}>
            <DateInput
                source="dateCreated"
                label="Date"
                fullWidth
                defaultValue={moment().format('MM/DD/YYYY')}
                disabled={true}
                InputProps={{ disableUnderline: true, classes: { root: classes.customRoot, input: classes.customInput } }}
                InputLabelProps={{ shrink: true, className: classes.customFormLabel }}
            />
        </FormGroup>

    </React.Fragment>
);

export default withStyles(formStyles)(MedicationsInputs);
