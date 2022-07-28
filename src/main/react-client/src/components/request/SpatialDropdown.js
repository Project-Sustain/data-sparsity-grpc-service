import { Select, FormControl, MenuItem, InputLabel } from '@mui/material';
import { makeStyles } from "@material-ui/core";


const useStyles = makeStyles({
    select: {
      margin: "10px",
    }
  });


export default function SpatialDropdown(props) {
    const classes = useStyles();

    return (
        <FormControl fullWidth className={classes.select}>
            <InputLabel>{props.label}</InputLabel>
            <Select
                disabled={props.disabled}
                value={props.value}
                label={props.label}
                onChange={props.update}
            >
                {
                    props.options.map((location, index) => {
                        return (
                            <MenuItem key={index} value={location}>{location.name}</MenuItem>
                        );
                    })
                }
            </Select>
        </FormControl>
    );

}