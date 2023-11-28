import { Box, Typography } from "@mui/material";
import TextEditor from "./components/TextEditor";
import { useState } from "react";
import { Editor, EditorState, convertFromRaw } from "draft-js";

export default function App() {
  const [data, setData] = useState({blocks:[]});

  function addItem(item) {
    setData({...data, blocks: item});
  }

  return (
    <Box sx={{minHeight:'100vh', bgcolor:'#21213E' }}>
      <Box
        sx={{
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
          fontWeight: 700,
        }}
      >
        <TextEditor
          info={{ blocks: [] }}
          func={addItem}
          item={0}
          style="contained"
          html="test it"
        />
      </Box>
      <Box  sx={{
          display: "flex",
          flexDirection:'column',
          alignItems: "center",
          justifyContent: "center",
          color:'white',
          borderTop:4,
          paddingY:2
        }}>
          <Typography sx={{borderBottom:4, width:'90%', display:'block', textAlign:'center', marginBottom:4}}>Result</Typography>
        <Editor
          editorState={EditorState.createWithContent(
            convertFromRaw({
              blocks: data.blocks,
              entityMap: {},
            })
          )}
          readOnly
        />
      </Box>
    </Box>
  );
}
