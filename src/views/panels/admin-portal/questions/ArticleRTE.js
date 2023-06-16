// import React, { useState } from "react";
// import "../digicard/Styles/article.css";
// import SunEditor from "../digicard/suneditor-react/dist/SunEditor";
// import "../digicard/Styles/suneditor.min.css";
// import '../digicard/suneditor/dist/suneditor.css'
// import katex from 'katex'
// import 'katex/dist/katex.min.css'
// import fontList from "../../../../helper/fontList";

// import 'suneditor/dist/css/suneditor.min.css';
// // import EditTable from './Table'

// import plugins from '../digicard/suneditor/src/plugins'

// function ArticleRTE({ setArticleSize, articleData, setArticleData, imageCount, setImageCount, setAnswerBlanksOptions, setQuestionEmptyErrMsg }) {

//   const handleEditorChange = (content) => {

//     console.log(content);

//     setQuestionEmptyErrMsg(false);
//     let arr = content.split(/[,.!&;<>\s]+/).filter(p => p.startsWith('$$'));
//     console.log("arr", arr);

//     let selectedArr = [];

//     // for (let j = 0; j < arr.length; j++) {

//     //   selectedArr.push({ label: arr[j].replace(/[$\s]+/g, ''), value: arr[j].replace(/[$\s]+/g, '') });

//     // }

//     //new
//     for (let j = 0; j < arr.length; j++) {
//       const value = arr[j].replace(/[$\s]+/g, '');

//       // Check if the value is not already present in selectedArr
//       const isDuplicate = selectedArr.some(item => item.value === value);
//       if (!isDuplicate) {
//         selectedArr.push({ label: value, value });
//       }
//     }
//     //new

//     setAnswerBlanksOptions(selectedArr);

//     let count = (content.match(/<img/g) || []).length;
//     function byteCount(s) {
//       return encodeURI(s).split(/%..|./).length - 1;
//     }
//     setArticleSize(false);
//     let a = byteCount(content) / 1024;
//     setArticleSize(a + 20);
//     setImageCount(count);
//     setArticleData(content);
//   };


//   return (
//     <div>
//       {/* <EditTable> </EditTable> */}
//       <SunEditor placeholder="Please type here..."
//         disable={sessionStorage.getItem("user_role") == "Viewer"}
//         setContents={articleData}
//         showToolbar={true}
//         onChange={handleEditorChange}
//         setDefaultStyle="height: 40vh; font-size: 16px;font-family: Cerebri Sans Pro;"
//         setOptions={{
//           imageUploadSizeLimit: "25000000",
//           katex: katex,
//           plugins: plugins,
//           font: fontList,
//           preview: [{ pathpath: '/admin-portal/admin-dashboard' }
//           ],
//           buttonList: [
//             ['undo', 'redo'],
//             ['font', 'fontSize', 'formatBlock'],
//             ['paragraphStyle', 'blockquote'],
//             ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
//             ['fontColor', 'hiliteColor', 'textStyle'],
//             ['removeFormat'],
//             '/', // Line break
//             ['outdent', 'indent'],
//             ['align', 'horizontalRule', 'list', 'lineHeight'],
//             ['table', 'link', 'image', 'video', 'audio' /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
//             /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
//             ['fullScreen'],
//             ['preview'],
//             // ['save', 'template'],
//             ['math']
//           ],
//         }}
//       />

//     </div>

//   );
// }

// export default ArticleRTE;


// //new
// // import React, { useState } from "react";
// // import "../digicard/Styles/article.css";
// // import SunEditor from "../digicard/suneditor-react/dist/SunEditor";
// // import "../digicard/Styles/suneditor.min.css";
// // import '../digicard/suneditor/dist/suneditor.css'
// // import katex from 'katex'
// // import 'katex/dist/katex.min.css'
// // import fontList from "../../../../helper/fontList";

// // import 'suneditor/dist/css/suneditor.min.css';
// // // import EditTable from './Table'

// // import plugins from '../digicard/suneditor/src/plugins'

// // function ArticleRTE({ setArticleSize, articleData, setArticleData, imageCount, setImageCount, setAnswerBlanksOptions, setQuestionEmptyErrMsg }) {
// //   const [isDuplicatePresent, setIsDuplicatePresent] = useState(false);

// //   const handleEditorChange = (content) => {
// //     console.log(content);
// //     setQuestionEmptyErrMsg(false);
// //     let arr = content.split(/[,.!&;<>\s]+/).filter(p => p.startsWith('$$'));
// //     console.log("arr", arr);

// //     let selectedArr = [];

// //     // for (let j = 0; j < arr.length; j++) {
// //     //   selectedArr.push({ label: arr[j].replace(/[$\s]+/g, ''), value: arr[j].replace(/[$\s]+/g, '') });
// //     // }

// //     // New implementation to handle duplicates
// //     for (let j = 0; j < arr.length; j++) {
// //       const value = arr[j].replace(/[$\s]+/g, '');

// //       // Check if the value is not already present in selectedArr
// //       const isDuplicate = selectedArr.some(item => item.value === value);
// //       if (!isDuplicate) {
// //         selectedArr.push({ label: value, value });
// //       }
// //     }
// //     // End of new implementation

// //     setAnswerBlanksOptions(selectedArr);

// //     let count = (content.match(/<img/g) || []).length;
// //     function byteCount(s) {
// //       return encodeURI(s).split(/%..|./).length - 1;
// //     }
// //     setArticleSize(false);
// //     let a = byteCount(content) / 1024;
// //     setArticleSize(a + 20);
// //     setImageCount(count);
// //     setArticleData(content);
// //   };

// //   const handleBlur = () => {
// //     const content = articleData;
// //     let arr = content.split(/[,.!&;<>\s]+/).filter(p => p.startsWith('$$'));
// //     let isDuplicatePresent = false;

// //     for (let i = 0; i < arr.length; i++) {
// //       const value = arr[i].replace(/[$\s]+/g, '');

// //       // Check if the value is duplicated
// //       const duplicates = arr.filter((item, index) => index !== i && item.replace(/[$\s]+/g, '') === value);
// //       if (duplicates.length > 0) {
// //         isDuplicatePresent = true;
// //         break;
// //       }
// //     }

// //     setIsDuplicatePresent(isDuplicatePresent);
// //   };

// //   return (
// //     <div>
// //       {/* <EditTable> </EditTable> */}
// //       <SunEditor
// //         placeholder="Please type here..."
// //         disable={sessionStorage.getItem("user_role") === "Viewer"}
// //         onBlur={handleBlur}
// //         setContents={articleData}
// //         showToolbar={true}
// //         onChange={handleEditorChange}
// //         setDefaultStyle="height: 40vh; font-size: 16px;font-family: Cerebri Sans Pro;"
// //         setOptions={{
// //           imageUploadSizeLimit: "25000000",
// //           katex: katex,
// //           plugins: plugins,
// //           font: fontList,
// //           preview: [{ pathpath: '/admin-portal/admin-dashboard' }],
// //           buttonList: [
// //             ['undo', 'redo'],
// //             ['font', 'fontSize', 'formatBlock'],
// //             ['paragraphStyle', 'blockquote'],
// //             ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
// //             ['fontColor', 'hiliteColor', 'textStyle'],
// //             ['removeFormat'],
// //             '/', // Line break
// //             ['outdent', 'indent'],
// //             ['align', 'horizontalRule', 'list', 'lineHeight'],
// //             ['table', 'link', 'image', 'video', 'audio' /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
// //             /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
// //             ['fullScreen'],
// //             ['preview'],
// //             // ['save', 'template'],
// //             ['math']
// //           ],
// //         }}
// //       />
// //       {isDuplicatePresent && <p style={{ color: "red" }}>Duplicate values found between $$ markers.</p>}
// //     </div>
// //   );
// // }

// // export default ArticleRTE;

import React, { useState } from "react";
import "../digicard/Styles/article.css";
import SunEditor from "../digicard/suneditor-react/dist/SunEditor";
import "../digicard/Styles/suneditor.min.css";
import '../digicard/suneditor/dist/suneditor.css'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import fontList from "../../../../helper/fontList";

import 'suneditor/dist/css/suneditor.min.css';
import plugins from '../digicard/suneditor/src/plugins'

function ArticleRTE({ setArticleSize, articleData, setArticleData, imageCount, setImageCount, setAnswerBlanksOptions, onChildStateChange }) {
  const [isDuplicatePresent, setIsDuplicatePresent] = useState(false);

  const handleEditorChange = (content) => {
    console.log(content);
    let arr = content.split(/[,.!&;<>\s]+/).filter(p => p.startsWith('$$'));
    console.log("arr", arr);

    let selectedArr = [];

    for (let j = 0; j < arr.length; j++) {
      const value = arr[j].replace(/[$\s]+/g, '');

      // Check if the value is not already present in selectedArr
      const isDuplicate = selectedArr.some(item => item.value === value);
      if (!isDuplicate) {
        selectedArr.push({ label: value, value });
        setIsDuplicatePresent(false);
        onChildStateChange(false)
      } else {
        setIsDuplicatePresent(true);
        onChildStateChange(true)
      }
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
      <SunEditor
        placeholder="Please type here..."
        disable={sessionStorage.getItem("user_role") === "Viewer"}
        setContents={articleData}
        showToolbar={true}
        onChange={handleEditorChange}
        setDefaultStyle="height: 40vh; font-size: 16px;font-family: Cerebri Sans Pro;"
        setOptions={{
          imageUploadSizeLimit: "250000",
          katex: katex,
          plugins: plugins,
          font: fontList,
          preview: [{ pathpath: '/admin-portal/admin-dashboard' }],
          buttonList: [
            ['undo', 'redo'],
            ['font', 'fontSize', 'formatBlock'],
            ['paragraphStyle', 'blockquote'],
            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['fontColor', 'hiliteColor', 'textStyle'],
            ['removeFormat'],
            '/',
            ['outdent', 'indent'],
            ['align', 'horizontalRule', 'list', 'lineHeight'],
            ['table', 'link', 'image', 'video', 'audio'],
            ['fullScreen'],
            ['preview'],
            ['math']
          ],
        }}
      />

      {isDuplicatePresent && <p style={{ color: "red", fontSize: "12px" }}>Duplicate values found between $$ markers.</p>}
    </div>
  );
}

export default ArticleRTE;
