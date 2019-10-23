import React, { useState } from "react";
import { TextInput, DateInput, LongTextInput } from "react-admin";
import moment from "moment";

import { withStyles } from '@material-ui/core/styles';
import FormGroup from "@material-ui/core/FormGroup";

import PropTypes from 'prop-types';
import clsx from 'clsx';
import _ from "lodash";
import deburr from 'lodash/deburr';
import Downshift from 'downshift';
import Popper from '@material-ui/core/Popper';

import formStyles from "../../../config/formStyles";
import { Field } from 'redux-form';

import { emphasize, makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel'

import axios from "axios";


/**
 * This component returns inputs for Problems creation/editing forms
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
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
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
  selectedItem: PropTypes.string.isRequired,
  suggestion: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
};

function performSearch(value)
{
	const apiUrl = `https://cpcr01.tcd.ie/snomedapi/api/v1/medication_catalog/search/elastic/ipu_vtm`;
    let url = `${apiUrl}/${value}`;
    if (value !== "") {
      axios
        .get(url, {
          headers: {
            Authorization: `JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lZGljYXRpb25fY2F0YWxvZ0B0ZXN0LmNvbSIsIl9pZCI6IjVkOGIzMTA2N2VhNDBjNTM2NDQ4MTY1OCIsImlhdCI6MTU2OTQ4ODQ0NywiZXhwIjoxNjAxMDI0NDQ3fQ.nzvZ999pcagZbp2OfzrIWqS8fDkxeYm3rYsefO4YZDI`
          }
        }) //paracetamol venlafaxine bupropion
        .then(response => {
          if (response.data.hits !== undefined) {
            let searchResults = response.data.hits.hits.map(element => {
              return {
                label: element._source.NM.toString(),
                value: element._id
              }
            });
            //console.log(searchResults);
            suggestions = searchResults;
            //setSuggestions(searchResults);
            //console.log(suggestions);
          }
        })
        .catch(error => {
          return error;
        });
    }
}

function performSearchGeneric(value)
{
	const apiUrl = `https://cpcr01.tcd.ie/snomedapi/api/v1/medication_catalog/search/elastic/ipu_vmp`;
    let url = `${apiUrl}/${value}`;
    if (value !== "") {
      axios
        .get(url, {
          headers: {
            Authorization: `JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lZGljYXRpb25fY2F0YWxvZ0B0ZXN0LmNvbSIsIl9pZCI6IjVkOGIzMTA2N2VhNDBjNTM2NDQ4MTY1OCIsImlhdCI6MTU2OTQ4ODQ0NywiZXhwIjoxNjAxMDI0NDQ3fQ.nzvZ999pcagZbp2OfzrIWqS8fDkxeYm3rYsefO4YZDI`
          }
        }) //paracetamol venlafaxine bupropion
        .then(response => {
          if (response.data.hits !== undefined) {
            let searchResults = response.data.hits.hits.map(element => {
              return {
                label: element._source.NM.toString(),
                value: element._id
              }
            });
            //console.log(searchResults);
            genericSuggestions = searchResults;
            //setSuggestions(searchResults);
            //console.log(genericSuggestions);
          }
        })
        .catch(error => {
          return error;
        });
    }
}

function performSearchBrand(value)
{
	const apiUrl = `https://cpcr01.tcd.ie/snomedapi/api/v1/medication_catalog/search/elastic/ipu_amp`;
    let url = `${apiUrl}/${value}`;
    if (value !== "") {
      axios
        .get(url, {
          headers: {
            Authorization: `JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lZGljYXRpb25fY2F0YWxvZ0B0ZXN0LmNvbSIsIl9pZCI6IjVkOGIzMTA2N2VhNDBjNTM2NDQ4MTY1OCIsImlhdCI6MTU2OTQ4ODQ0NywiZXhwIjoxNjAxMDI0NDQ3fQ.nzvZ999pcagZbp2OfzrIWqS8fDkxeYm3rYsefO4YZDI`
          }
        }) //paracetamol venlafaxine bupropion
        .then(response => {
          if (response.data.hits !== undefined) {
            let searchResults = response.data.hits.hits.map(element => {
              return {
                label: element._source.NM.toString(),
                value: element._id
              }
            });
            //console.log(searchResults);
            brandSuggestions = searchResults;
            //setSuggestions(searchResults);
            //console.log(genericSuggestions);
          }
        })
        .catch(error => {
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

  performSearchGeneric(value);

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

  performSearchBrand(value);

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

 const renderTextField = ({ classes, input, label, meta: { touched, error }, ...custom }) => (
   <Downshift id="downshift-simple" {...input} >
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
                       itemProps: getItemProps({ item: suggestion.label, disableUnderline: true }),
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
   <Downshift id="downshift-simple" {...input} >
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
                       itemProps: getItemProps({ item: suggestion.label, disableUnderline: true }),
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
   <Downshift id="downshift-simple" {...input} >
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
                       itemProps: getItemProps({ item: suggestion.label, disableUnderline: true }),
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

const ProblemsInput = ({ classes, ...rest }) => (
    <span>
        <Field name="problem"  component={renderTextField}/>
    </span>
);

const GenericFormulaInput = ({ classes, ...rest }) => (
    <span>
        <Field name="problemGeneric"  component={renderTextFieldGeneric}/>
    </span>
);

const BrandFormulaInput = ({ classes, ...rest }) => (
    <span>
        <Field name="problemBrand"  component={renderTextFieldBrand}/>
    </span>
);


const ProblemsInputs = ({ classes, ...rest }) => (
    <React.Fragment>

        <FormGroup className={classes.formGroup}>
      	    <ProblemsInput
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
            <DateInput
                source="dateOfOnset"
                label="Date of Onset"
                fullWidth
                InputProps={{ disableUnderline: true, classes: { root: classes.customRoot, input: classes.customInput } }}
                InputLabelProps={{ shrink: true, className: classes.customFormLabel }}
            />
        </FormGroup>

        <FormGroup className={classes.formGroup}>
            <LongTextInput
                source="description"
                label="Description"
                rows={20}
                fullWidth
                InputProps={{ disableUnderline: true, classes: { root: classes.customRoot, input: classes.customTextarea } }}
                InputLabelProps={{ shrink: true, className: classes.customFormLabel }}
            />
        </FormGroup>

        <FormGroup className={classes.formGroup}>
            <TextInput
                source="code"
                label="Terminology Code"
                fullWidth
                InputProps={{ disableUnderline: true, classes: { root: classes.customRoot, input: classes.customInput } }}
                InputLabelProps={{ shrink: true, className: classes.customFormLabel }}
            />
        </FormGroup>

        <FormGroup className={classes.formGroup}>
            <TextInput
                source="terminology"
                label="Terminology"
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

export default withStyles(formStyles)(ProblemsInputs);
