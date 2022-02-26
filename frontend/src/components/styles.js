import React from 'react'
import { makeStyles,TextField,Button } from '@material-ui/core';

const styles = () => {
    const useStyles = makeStyles(() => ({
        textField: {
          paddingBottom: 20,
        },
        input: {
          color: "white"
        },
        regButton: {
            backgroundColor: "#00a896",
            cursor: "pointer",
        }
      }));
    
    const classes = useStyles();
  return (
    <div>
      Hello!
    </div>
  )
}

export default styles;