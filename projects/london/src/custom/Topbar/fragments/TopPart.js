import React, { Component } from "react";
import get from "lodash/get";
import { connect } from 'react-redux';
import { goBack } from 'react-router-redux';

import { withStyles } from '@material-ui/core/styles';
import CardMedia from "@material-ui/core/CardMedia";
import HomeIcon from "@material-ui/icons/Home";
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import { ContrastMode, userSearchAction, UserSearch } from "pulsetile-react-admin";

import helmLogo from "../../../images/logo-header.png";
import UserPanelButton from "./UserPanelButton";

const styles = theme => ({
    topPart: {
        display: "flex",
        backgroundColor: "white",
        justifyContent: "space-around",
        border: `1px solid ${theme.palette.borderColor}`,
        minHeight: 54,
        padding: 0,
    },
    homeButtonItem: {
        display: "inline-flex",
        position: "relative",
        minHeight: 54,
        minWidth: 54,
        backgroundColor: theme.palette.mainColor,
        justifyContent: "center",
        alignItems: "center",
    },
    homeButton : {
        color: "white",
    },
    mainLogoItem: {
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 9,
    },
    image: {
        width: "auto",
        cursor: "pointer",
    },
    userSearch: {
        maxWidth: 360,
        marginRight: 10,
    },
    nhsLogo: {
        [theme.breakpoints.only('xs')]: {
            display: "none",
        },
        width: "auto",
        maxWidth: "100%",
        marginRight: 24
    },
    rightBlockItem: {
        display: "inline-flex",
        position: "relative",
        minHeight: 54,
        minWidth: 54,
        justifyContent: "center",
        alignItems: "center",
        borderLeft: `1px solid ${theme.palette.borderColor}`,
        '&:hover': {
            backgroundColor: theme.palette.mainColor,
        },
        '&:active': {
            backgroundColor: theme.palette.mainColor,
        },
        '&:hover button': {
            color: "white",
        },
        '&:active button': {
            color: "white",
        },
        '&:hover a': {
            color: "white",
        },
        '&:active a': {
            color: "white",
        },
    },
    rightBlockButton: {
        color: theme.palette.mainColor,
        '&:hover': {
            color: "white",
        },
    },
    emptyBlock: {
        flexGrow: 1,
    }
});

/**
 * This component returns Top part of Helm Topbar
 *
 * @author Bogdan Shcherban <bsc@piogroup.net>
 */
class TopPart extends Component {

    goHomePage = () => {
        this.props.removeUserSearch();
        window.location.replace('/#/');
    };

    render() {
        const { classes, location } = this.props;
        return (
            <Toolbar className={classes.topPart}>
                <div className={classes.homeButtonItem}>
                    <Tooltip title="Home">
                        <IconButton id="icon-home" aria-label="Home" className={classes.homeButton} onClick={() => this.goHomePage()}>
                            <HomeIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className={classes.mainLogoItem}>
                    <CardMedia
                        id="logo-image"
                        className={classes.image}
                        component="img"
                        alt="Pulse Tile"
                        height="38px"
                        image={helmLogo}
                        title="Pulse Tile"
                        onClick={() => this.goHomePage()}
                    />
                </div>
                <div className={classes.emptyBlock}></div>
                <div className={classes.userSearch}>
                    <UserSearch location={location} />
                </div>
                <ContrastMode classes={classes} />
                <UserPanelButton classes={classes} />
            </Toolbar>
        );
    }
};

const mapStateToProps = state => {
    return {
        advancedSearchInfo: get(state, 'custom.advancedSearch.data', null),
        clinicalQueryInfo: get(state, 'custom.clinicalQuery.data', null),
    }
};

const mapDispatchToProps = dispatch => {
    return {
        removeUserSearch() {
            dispatch(userSearchAction.remove());
        },
        goBack() {
            dispatch(goBack());
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TopPart));