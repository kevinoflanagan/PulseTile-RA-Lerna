import React, { Component } from "react";
import get from "lodash/get";
import { connect } from 'react-redux';

import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormGroup from "@material-ui/core/FormGroup";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";

import {
    synopsisAllergiesAction,
    synopsisContactsAction,
    synopsisMedicationsAction,
    synopsisProblemsAction,
    synopsisVaccinationsAction,
    synopsisTopThreeThingsAction
} from "../../actions/synopsisActions";

import { emergencySummaryAction } from "../../actions/emergencySummaryAction";
import { currentPatientAction } from "../../actions/currentPatientAction";

import PatientSummaryTable from "./views/PatientSummaryTable";
import PatientSummaryRoll from "./views/PatientSummaryRoll";
import SettingsDialog from "./SettingsDialog";
import Breadcrumbs from "../../common/Breadcrumbs";

// import { synopsisData } from "./config";
// import { getSummaryContainerStyles } from "./functions";

const styles = theme => ({
    summaryContainer: {
        margin: 0,
        width: '100%',
    },
    container: {
        width: "100%",
        height: "100%",
        background: theme.patientSummaryPanel.container.background,
        backgroundSize: "cover",
    },
    toggleViewBlock: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    formGroup: {
        width: "98%",
        paddingTop: 5,
        boxSizing: "border-box",
    },
    formGroupLabel: {
        marginTop: 18,
    },
    formControlLabel: {
        marginBottom: 10,
    },
    radioGroup: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        marginLeft: 15,
        marginRight: 10,
    },
    radio: {
        '&$checked': {
            color: theme.palette.mainColor,
        }
    },
    checked: {}
});

const TABLE_VIEW = 'table';
const ROLL_VIEW = 'roll';

class PatientSummaryWithContext extends Component {

    state = {
        isRollView: false,
    };

    toggleView = () => {
        this.setState({
            isRollView: !this.state.isRollView,
        });
    };

    componentDidMount() {
        const { isRollViewDefault, contextProps } = this.props;
        if (isRollViewDefault) {
            this.toggleView();
        }
        const isNodeRedVersion = get(contextProps, 'themeCommonElements.isNodeRedVersion', false);
        const isQwedVersion = get(contextProps, 'themeCommonElements.isQwedVersion', false);
        if (isQwedVersion) {
            this.getPatientSummaryInfo();
        }
        if (isNodeRedVersion) {
            this.getPatientSummaryNodeRedInfo()
        }
    }

    getPatientSummaryNodeRedInfo = () => {
        this.props.updateCurrentPatientNodeRed(localStorage.getItem('patientId'));
        this.props.getPatientSynopsisNodeRed();
    };

    getPatientSummaryInfo = () => {
        if (localStorage.getItem('role') === 'PHR') {
            this.props.updateCurrentPatient(localStorage.getItem('patientId'));
        }
        if (localStorage.getItem('userId') && localStorage.getItem('username')) {
            this.props.getPatientSynopsis();
            // this.props.getEmergencySummary(localStorage.getItem('patientId'));
        }
    };

    componentWillReceiveProps(nextProps, nextContent) {
        const { patientInfo } = this.props;
        if (patientInfo !== nextProps.patientInfo) {
            // this.props.getRandomPhoto(get(nextProps, 'patientInfo.gender', 'male'));
        }
    }

    render() {
        const { classes, contextProps, isRollViewDefault, location, history } = this.props;
        const { isRollView } = this.state;
        const breadcrumbsResource = [
            { url: location.pathname, title: "Patient Summary", isActive: false }
        ];
        const viewType = isRollView ? ROLL_VIEW : TABLE_VIEW;
        return (
            <Grid id="patientSummary" className={classes.container} >
                <Breadcrumbs resource={breadcrumbsResource} />
                <div className={classes.toggleViewBlock}>
                    <SettingsDialog className={classes.settingsIcon} contextProps={contextProps} />
                    {
                        isRollViewDefault &&
                            <div className={classes.toggleViewBlock} >
                                <Typography variant="h1" className={classes.formGroupLabel}>View</Typography>
                                <FormGroup className={classes.formGroup}>
                                    <RadioGroup name="viewType" className={classes.radioGroup} value={viewType} onChange={() => this.toggleView()} row>
                                        <FormControlLabel
                                            className={classes.formControlLabel}
                                            value={ROLL_VIEW}
                                            control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />}
                                            label="Roll"
                                        />
                                        <FormControlLabel
                                            className={classes.formControlLabel}
                                            value={TABLE_VIEW}
                                            control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />}
                                            label="Table"
                                        />
                                    </RadioGroup>
                                </FormGroup>
                            </div>
                    }
                </div>
                <Grid className={classes.summaryContainer} spacing={16} container>
                {
                    isRollView ?
                        <PatientSummaryRoll history={history} contextProps={contextProps} /> :
                        <PatientSummaryTable history={history} contextProps={contextProps} />
                }
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        patientInfo: get(state, 'custom.currentPatient.patientInfo.data', null),
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const synopsisActions = [
        { plugin: 'allergies', action: synopsisAllergiesAction },
        { plugin: 'contacts', action: synopsisContactsAction },
        { plugin: 'problems', action: synopsisProblemsAction },
        { plugin: 'medications', action: synopsisMedicationsAction },
        { plugin: 'vaccinations', action: synopsisVaccinationsAction },
        { plugin: 'top3Things', action: synopsisTopThreeThingsAction },
    ];
    const pluginsList = get(ownProps, 'pluginsList', []);
    return {
        getPatientSynopsis() {
            synopsisActions.map(item => {
                if (pluginsList.indexOf(item.plugin) !== -1) {
                    return dispatch(item.action.request());
                }
                return null;
            });
        },
        getPatientSynopsisNodeRed() {
            synopsisActions.map(item => {
                if (pluginsList.indexOf(item.plugin) !== -1) {
                    return dispatch(item.action.requestNodeRed());
                }
                return null;
            });
        },
        getEmergencySummary(patientId) {
            dispatch(emergencySummaryAction.request('vitalsigns', patientId));
        },
        getRandomPhoto(gender) {
            dispatch(currentPatientAction.requestPhoto(gender));
        },
        updateCurrentPatient(data) {
            dispatch(currentPatientAction.request(data));
        },
        updateCurrentPatientNodeRed(data) {
            dispatch(currentPatientAction.requestNodeRed(data));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PatientSummaryWithContext));