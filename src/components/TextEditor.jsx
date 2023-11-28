import React, { useEffect, useRef, useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
} from "draft-js";

import Toolbar from "./Toolbar";
import "./TextEditor.css";
import { Box, Button, SwipeableDrawer, Typography } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import DoneIcon from "@mui/icons-material/Done";

export default function TextEditor(props) {
  // open and close editor
  const [state, setState] = useState(false);
  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState(open);
  };

  // disable btn
  const [disable, setDisable] = useState(true);

  //   editor functions
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(
      convertFromRaw({
        blocks: props.info.blocks,
        entityMap: {},
      })
    )
  );

  //   FOR INLINE STYLES
  const styleMap = {
    CODE: {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
    HIGHLIGHT: {
      backgroundColor: "#F7A5F7",
    },
    UPPERCASE: {
      textTransform: "uppercase",
    },
    LOWERCASE: {
      textTransform: "lowercase",
    },
    CODEBLOCK: {
      fontFamily: '"fira-code", "monospace"',
      fontSize: "inherit",
      background: "#ffeff0",
      fontStyle: "italic",
      lineHeight: 1.5,
      padding: "0.3rem 0.5rem",
      borderRadius: " 0.2rem",
    },
    SUPERSCRIPT: {
      verticalAlign: "super",
      fontSize: "80%",
    },
    SUBSCRIPT: {
      verticalAlign: "sub",
      fontSize: "80%",
    },
  };

  // FOR BLOCK LEVEL STYLES(Returns CSS Class From DraftEditor.css)
  const myBlockStyleFn = (contentBlock) => {
    const type = contentBlock.getType();
    switch (type) {
      case "blockQuote":
        return "superFancyBlockquote";
      case "leftAlign":
        return "leftAlign";
      case "rightAlign":
        return "rightAlign";
      case "centerAlign":
        return "centerAlign";
      case "justifyAlign":
        return "justifyAlign";
      default:
        break;
    }
  };

  // btn functions
  const cancelTask = () => {
    setEditorState(
      EditorState.createWithContent(
        convertFromRaw({
          blocks: [],
          entityMap: {},
        })
      )
    );
    setState(false);
  };
  const addTask = () => {
    const contentState = editorState.getCurrentContent();
    const contentObject = convertToRaw(contentState);
    props.func(contentObject.blocks);
    cancelTask();
  };

  return (
    <React.Fragment key={"top"}>
      <Button
        variant={props.style}
        sx={{ fontWeight: 700, bgcolor: "#F6C927", color: "#121231" }}
        onClick={toggleDrawer(true)}
      >
        {props.html}
      </Button>
      <SwipeableDrawer
        anchor={"top"}
        open={state}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box sx={{ bgcolor: "#21213E", width: "100vw" }} role="presentation">
          <Box sx={{ width: "80%", margin: "20vh auto 0" }}>
            <div className="editor-wrapper">
              <Toolbar
                editorState={editorState}
                setEditorState={setEditorState}
              />
              <div className="editor-container">
                <Editor
                  placeholder="Write Here"
                  editorState={editorState}
                  customStyleMap={styleMap}
                  blockStyleFn={myBlockStyleFn}
                  onChange={(editorState) => {
                    const contentState = editorState.getCurrentContent();
                    const contentObject = convertToRaw(contentState);
                    if (contentObject.blocks[0].text === "") {
                      setDisable(true);
                    } else {
                      setDisable(false);
                    }
                    setEditorState(editorState);
                  }}
                />
              </div>
            </div>
          </Box>

          <Box
            sx={{
              width: "80%",
              margin: "20px auto 10vh",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={cancelTask}
              sx={{ fontWeight: 700, bgcolor: "#F6C927", color: "#121231", height:36}}

              variant="contained"
              startIcon={<KeyboardBackspaceIcon />}
            >
              cancel
            </Button>
            <Button
              sx={{ fontWeight: 700, bgcolor: "#F6C927", color: "#121231", height:36 }}
              variant="contained"
              startIcon={<DoneIcon />}
              disabled={disable}
              onClick={addTask}
            >
                <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                  Submit
                </Typography>
              
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>
    </React.Fragment>
  );
}
