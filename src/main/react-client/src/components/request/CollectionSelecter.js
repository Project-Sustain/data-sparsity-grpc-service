import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    select: {
      margin: "10px",
    }
  });


export default function CollectionSelector(props) {
    const classes = useStyles();

    const updateCollection = (event) => {
        props.setCollection(event.target.value);
    }

    if(props.sparsityMetadata.length > 0) {
        return (
            <FormControl fullWidth className={classes.select}>
                <InputLabel>Dataset</InputLabel>
                <Select
                    value={props.collection}
                    label="Dataset"
                    onChange={updateCollection}
                >
                    {
                        props.sparsityMetadata.map((dataset, index) => {
                            return (
                                <MenuItem key={index} value={dataset}>{dataset.label}</MenuItem>
                            );
                        })
                    }
                </Select>
            </FormControl>
        );
    }

    else return null;
    
}