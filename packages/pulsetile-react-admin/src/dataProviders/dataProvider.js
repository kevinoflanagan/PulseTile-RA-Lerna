import get from "lodash/get";
import { GET_LIST, GET_ONE, CREATE, UPDATE, HttpError } from "react-admin";
import moment from "moment";
import sort, { ASC, DESC } from 'sort-array-objects';
import pluginFilters from "../config/pluginFilters";
import { token, domainName } from "../token";
import fakeTestResultsProvider from "./fakeTestResultsProvider";
import newPatientsProvider from "./patientsProvider";
import { checkFormData } from "./functions";
var apiPatientsUser = 'api/patients';
/**
 * This constant prepare data for requests (URL and options)
 *
 * @author Bogdan Shcherban <bsc@piogroup.net>
 * @param {shape}  type
 * @param {string} resource
 * @param {shape}  params
 */

var convertDataRequestToHTTP = function convertDataRequestToHTTP(type, resource, params) {
  var url = "";
  var options = {};

  switch (type) {
    case GET_LIST:
      {
        url = domainName + "/" + apiPatientsUser + "/" + localStorage.getItem('patientId') + "/" + resource;

        if (!options.headers) {
          options.headers = new Headers({
            Accept: 'application/json'
          });
        }

        options.headers = {
          Authorization: "Bearer " + token,
          'X-Requested-With': "XMLHttpRequest"
        };
        break;
      }

    case GET_ONE:
      url = domainName + "/" + apiPatientsUser + "/" + localStorage.getItem('patientId') + "/" + resource + "/" + params.id;

      if (!options.headers) {
        options.headers = new Headers({
          Accept: 'application/json'
        });
      }

      options.headers = {
        Authorization: "Bearer " + token,
        'X-Requested-With': "XMLHttpRequest"
      };
      break;

    case UPDATE:
      checkFormData(resource, params);
      var updateData = Object.assign({
        userId: localStorage.getItem('patientId')
      }, params.data);

      if (resource === 'problems') {
        var dateCreated = get(params, 'data.dateCreated', null);
        var dateOfOnset = get(params, 'data.dateOfOnset', null);
        updateData.dateCreated = moment(dateCreated).format('DD-MM-YYYY');
        updateData.dateOfOnset = moment(dateOfOnset).format('YYYY-MM-DD');
      }

      if (resource === 'medications') {
        var startDate = get(params, 'data.startDate', null);
        updateData.startDate = 1000 * moment(startDate).unix();
      }

      url = domainName + "/" + apiPatientsUser + "/" + localStorage.getItem('patientId') + "/" + resource + "/" + params.id;
      options.method = "PUT";

      if (!options.headers) {
        options.headers = new Headers({
          Accept: 'application/json'
        });
      }

      options.headers = {
        Authorization: "Bearer " + token,
        'Content-Type': 'application/json',
        'X-Requested-With': "XMLHttpRequest"
      };
      options.body = JSON.stringify(updateData);
      break;

    case CREATE:
      checkFormData(resource, params);
      var newData = Object.assign({
        userId: localStorage.getItem('patientId')
      }, params.data);

      if (resource === 'medications') {
        if (newData.medicationGeneric) {
          if (newData.medicationBrand) {
            newData.name = newData.medicationBrand.label;
          } else {
            newData.name = newData.medicationGeneric.label;
          }
        } else {
          newData.name = newData.name.label;
        } //delete newData.medicationBrand;
        //delete newData.medicationGeneric;
        //newData.name="Testing";

      }

      url = domainName + "/" + apiPatientsUser + "/" + localStorage.getItem('patientId') + "/" + resource;
      options.method = "POST";

      if (!options.headers) {
        options.headers = new Headers({
          Accept: 'application/json'
        });
      }

      options.headers = {
        Authorization: "Bearer " + token,
        'Content-Type': 'application/json',
        'X-Requested-With': "XMLHttpRequest"
      };
      options.body = JSON.stringify(newData);
      break;

    default:
      throw new Error("Unsupported fetch action type " + type);
  }

  return {
    url: url,
    options: options
  };
};
/**
 * This function extracts results from response
 *
 * @author Bogdan Shcherban <bsc@piogroup.net>
 * @param {shape}  response
 * @return {array}
 */


function getResultsFromResponse(response) {
  return response.map(function (item, id) {
    return Object.assign({
      number: id + 1,
      id: item.sourceId
    }, item);
  });
}
/**
 * This function cheks is current item consider to filter condition
 *
 * @author Bogdan Shcherban <bsc@piogroup.net>
 * @param {shape}  item
 * @param {shape}  filters
 * @param {string} filterText
 * @return {boolean}
 */


function isItemConsider(item, filters, filterText) {
  var result = false;
  filters.forEach(function (filterItem) {
    var string = item[filterItem];

    if (String(string).toLowerCase().search(filterText) >= 0) {
      result = true;
    }
  });
  return result;
}
/**
 * This function filters response array
 *
 * @author Bogdan Shcherban <bsc@piogroup.net>
 * @param {string} resource
 * @param {array}  results
 * @param {shape}  params
 * @return {array}
 */


function getFilterResults(resource, results, params) {
  var filterText = get(params, 'filter.filterText', null);
  var filters = pluginFilters[resource];
  return !filterText ? results : results.filter(function (item) {
    return isItemConsider(item, filters, filterText);
  });
}
/**
 * This function sorts response array
 *
 * @author Bogdan Shcherban <bsc@piogroup.net>
 * @param {array}  results
 * @param {shape}  params
 * @return {array}
 */


function getSortedResults(results, params) {
  var sortField = get(params, 'sort.field', null);
  var sortOrder = get(params, 'sort.order', null) === 'DESC' ? DESC : ASC;
  return sort(results, [sortField], sortOrder);
}
/**
 * This constant handle response data
 *
 * @author Bogdan Shcherban <bsc@piogroup.net>
 * @param {shape}  response
 * @param {shape}  type
 * @param {string} resource
 * @param {shape}  params
 */


var convertHTTPResponse = function convertHTTPResponse(response, type, resource, params) {
  switch (type) {
    case GET_LIST:
      var pageNumber = get(params, 'pagination.page', 1);
      var numberPerPage = get(params, 'pagination.perPage', 10);
      var results = getResultsFromResponse(response);
      var resultsFiltering = getFilterResults(resource, results, params);
      var resultsSorting = getSortedResults(resultsFiltering, params);
      var startItem = (pageNumber - 1) * numberPerPage;
      var endItem = pageNumber * numberPerPage;
      var paginationResults = resultsSorting.slice(startItem, endItem);
      return {
        data: paginationResults,
        total: results.length
      };

    case GET_ONE:
      return {
        data: Object.assign({
          id: response.sourceId
        }, response)
      };

    case UPDATE:
      return params;

    case CREATE:
      var dataFromRequest = get(params, 'data', null);
      var compositionUid = get(response, 'compositionUid', null);
      var sourceID = '';

      if (compositionUid) {
        var compositionUidArray = compositionUid.split('::');
        sourceID = compositionUidArray[0];
      }

      dataFromRequest.id = get(response, 'host', null) + '-' + sourceID;
      dataFromRequest.isNew = true;

      if (!get(params, 'source', null)) {
        dataFromRequest.source = 'ethercis';
      }

      return {
        data: dataFromRequest
      };

    default:
      return {
        data: 'No results'
      };
  }
};

var dataProvider = function dataProvider(type, resource, params) {
  var _a = convertDataRequestToHTTP(type, resource, params),
      url = _a.url,
      options = _a.options;

  var responseInfo = '';
  return fetch(url, options).then(function (response) {
    responseInfo = get(response, 'status', null);
    return response.json();
  }).then(function (res) {
    if (responseInfo !== 200) {
      responseInfo += '|' + get(res, 'error', null);
      throw new HttpError(responseInfo);
    }

    return convertHTTPResponse(res, type, resource, params);
  }).catch(function (err) {
    console.log('Error: ', err);
    throw new Error(err);
  });
};
/**
 * This function provides requests/response to server
 *
 * @author Bogdan Shcherban <bsc@piogroup.net>
 * @param {shape}  type
 * @param {string} resource
 * @param {shape}  params
 */


export default (function (type, resource, params) {
  // if (resource === `patients`) {
  //     return fakePatientsProvider(type, resource, params);
  // }
  if (resource === "patients") {
    return newPatientsProvider(type, resource, params);
  }

  if (resource === "labresults") {
    return fakeTestResultsProvider(type, resource, params);
  }

  return dataProvider(type, resource, params);
});