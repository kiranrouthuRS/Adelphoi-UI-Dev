import React from 'react';
import PropTypes from 'prop-types';
import { jsx, css } from "@emotion/core";
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        // paddingTop: theme.spacing.unit * 1,
        // paddingBottom: theme.spacing.unit * 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        // marginTop: theme.spacing.unit * 1,
        // padding: `${theme.spacing.unit * 1}px 0`,
    }
});

const firstMatchLogo = css`
position: absolute;
transform: translate(-50%, -50%);
left: 50%;
top: -0px;
@media all and (max-width: 520px) {
  width: 80px;
}
`;
function Footer(props) {
    const { classes } = props;

    return (
        <footer >
            <Paper  elevation={1}>
            <Table aria-label="users table" >

                <TableHead>
                    <TableRow>
                        <TableCell >
                        <Typography variant="h6" >
                        © Copyright, All right reserved by FirstMatch - 2021
                        </Typography>
        </TableCell>
                        <TableCell >
                        <Typography >
                        Powered by:
                        </Typography>
        </TableCell>
                        <TableCell >
                        <img
           css={firstMatchLogo}
           height="40px"
           width="100px"
          alt="FirstMatch Logo"
          src="/img/logo_stroke.png"
        />
        </TableCell>

                    </TableRow>
                </TableHead>
                </Table>
                </Paper>
                {/* <Paper  elevation={1}>
        <Typography variant="h6" component="h3" align="left"> 
        © Copy right, All right reserved by FirstMatch - 2021
        </Typography>
        <Typography component="p" align="right" >
        Powered by: <img
           css={firstMatchLogo}
           height="20px"
           width="100px"
          alt="FirstMatch Logo"
          src="/img/logo_stroke.png"
        />
        </Typography>
      </Paper> */}
    </footer>
  );
}

Footer.propTypes = {
                classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Footer);