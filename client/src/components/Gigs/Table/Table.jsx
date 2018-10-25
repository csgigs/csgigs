import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';

// core components
import Pagination from "./Pagination.jsx";

import tableStyle from "assets/jss/material-dashboard-pro-react/components/tableStyle";

class GigsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 5,
        };
    };

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };

    setupTableCell = (colspan, value) => {
        const {classes} = this.props;
        const tableCellClasses = classes.tableCell;
        return (
            <TableCell colSpan={colspan} className={tableCellClasses}>
                {value}
            </TableCell>
        );
    };

    render() {
        const {
            classes,
            tableHead,
            tableData,
            tableHeaderColor,
            hover,
            striped,
            tableShopping,
            customHeadCellClasses,
            customHeadClassesForCells,
            handleTableRowOnClick
        } = this.props;
        const {page, rowsPerPage} = this.state;

        return (
            <div className={classes.tableResponsive}>
                <Table className={classes.table}>
                    {tableHead !== undefined ? (
                        <TableHead className={classes[tableHeaderColor]}>
                            <TableRow className={classes.tableRow}>
                                {tableHead.map((prop, key) => {
                                    const tableCellClasses =
                                        classes.tableHeadCell +
                                        " " +
                                        classes.tableCell +
                                        " " +
                                        cx({
                                            [customHeadCellClasses[
                                                customHeadClassesForCells.indexOf(key)
                                                ]]:
                                            customHeadClassesForCells.indexOf(key) !== -1,
                                            [classes.tableShoppingHead]: tableShopping,
                                            [classes.tableHeadFontSize]: !tableShopping
                                        });
                                    return (
                                        <TableCell className={tableCellClasses} key={key}>
                                            {prop}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                    ) : null}
                    <TableBody>
                        {tableData.length ?
                            (tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((prop, key) => {
                                var rowColor = "";
                                var rowColored = false;
                                const tableRowClasses = cx({
                                    [classes.tableRowHover]: hover,
                                    [classes[rowColor + "Row"]]: rowColored,
                                    [classes.tableStripedRow]: striped && key % 2 === 0
                                });
                                return (
                                    <TableRow
                                        key={key}
                                        hover={hover}
                                        className={classes.tableRow + " " + tableRowClasses}
                                        onClick={() => {
                                            (handleTableRowOnClick) ? handleTableRowOnClick(prop) : null
                                        }}
                                        style={{'cursor': 'pointer'}}
                                    >
                                        {this.setupTableCell(1, prop.name)}
                                        {this.setupTableCell(1, prop.admin)}
                                        {this.setupTableCell(1, prop.status)}
                                    </TableRow>
                                );
                            })) :
                            (
                                <TableRow>
                                    {this.setupTableCell(3, "No gigs found")}
                                </TableRow>
                            )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                colSpan={3}
                                count={tableData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                ActionsComponent={Pagination}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        );
    };
}

GigsTable.defaultProps = {
    tableHeaderColor: "gray",
    hover: false,
    colorsColls: [],
    coloredColls: [],
    striped: false,
    customCellClasses: [],
    customClassesForCells: [],
    customHeadCellClasses: [],
    customHeadClassesForCells: []
};

GigsTable.propTypes = {
    classes: PropTypes.object.isRequired,
    tableHeaderColor: PropTypes.oneOf([
        "warning",
        "primary",
        "danger",
        "success",
        "info",
        "rose",
        "gray"
    ]),
    tableHead: PropTypes.arrayOf(PropTypes.string),
    // Of(PropTypes.arrayOf(PropTypes.node)) || Of(PropTypes.object),
    tableData: PropTypes.array,
    hover: PropTypes.bool,
    coloredColls: PropTypes.arrayOf(PropTypes.number),
    // Of(["warning","primary","danger","success","info","rose","gray"]) - colorsColls
    colorsColls: PropTypes.array,
    customCellClasses: PropTypes.arrayOf(PropTypes.string),
    customClassesForCells: PropTypes.arrayOf(PropTypes.number),
    customHeadCellClasses: PropTypes.arrayOf(PropTypes.string),
    customHeadClassesForCells: PropTypes.arrayOf(PropTypes.number),
    striped: PropTypes.bool,
    // this will cause some changes in font
    tableShopping: PropTypes.bool
};

export default withStyles(tableStyle)(GigsTable);