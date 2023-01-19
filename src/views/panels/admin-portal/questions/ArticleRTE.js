import React from "react";
import "../digicard/Styles/article.css";
import SunEditor from "suneditor-react";
import "../digicard/Styles/suneditor.min.css";

import katex from 'katex'
import 'katex/dist/katex.min.css'

import 'suneditor/dist/css/suneditor.min.css';
// import EditTable from './Table'

import plugins from 'suneditor/src/plugins'

function ArticleRTE({ setArticleSize, articleData, setArticleData, imageCount, setImageCount, setAnswerBlanksOptions, setQuestionEmptyErrMsg }) {

  const handleEditorChange = (content) => {

    console.log(content);
    
    setQuestionEmptyErrMsg(false);
    let arr = content.split(/[,.!&;<>\s]+/).filter(p => p.startsWith('$$'));
    console.log("arr", arr);

    let selectedArr = [];

    for (let j = 0; j < arr.length; j++) {

      selectedArr.push({ label: arr[j].replace(/[$\s]+/g, ''), value: arr[j].replace(/[$\s]+/g, '') });

    }

    setAnswerBlanksOptions(selectedArr);

    let count = (content.match(/<img/g) || []).length;
    function byteCount(s) {
      return encodeURI(s).split(/%..|./).length - 1;
    }
    setArticleSize(false);
    let a = byteCount(content) / 1024;
    setArticleSize(a + 20);
    setImageCount(count);
    setArticleData(content);
  };

  return (
    <div>
      {/* <EditTable> </EditTable> */}
      <SunEditor placeholder="Please type here..."
        disable={sessionStorage.getItem("user_role") == "Viewer"}
        setContents={articleData}
        showToolbar={true}
        onChange={handleEditorChange}
        setDefaultStyle="height: 40vh; font-size: 16px;font-family: Cerebri Sans Pro;"
        setOptions={{
          // imageUploadSizeLimit: "250000",
          katex: katex,
          plugins: plugins,
          font: [
            'Arial',
            'tohoma',
            'Courier New,Courier',
            'Verdana',
            'Trebuchet MS',
            'Times New Roman',
            'Georgia',
            'Garamond',
            'Courier New',
            'Brush Script MT',
            'Times',
            'Helvetica',
            'Geneva',
            'Courier New',

          ],
          preview: [{ pathpath: '/admin-portal/admin-dashboard' }
          ],
          buttonList: [
            ['undo', 'redo'],
            ['font', 'fontSize', 'formatBlock'],
            ['paragraphStyle', 'blockquote'],
            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['fontColor', 'hiliteColor', 'textStyle'],
            ['removeFormat'],
            '/', // Line break
            ['outdent', 'indent'],
            ['align', 'horizontalRule', 'list', 'lineHeight'],
            ['table', 'link', 'image', 'video', 'audio' /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
            /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
            ['fullScreen'],
            ['preview'],
            // ['save', 'template'],
            ['math']
          ],
        }}
      />
    </div>
  );
}

export default ArticleRTE;