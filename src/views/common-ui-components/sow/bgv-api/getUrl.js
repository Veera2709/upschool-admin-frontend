import dynamicUrl from "../../../../helper/dynamicUrls";

export const getUrl = async (existingData, newData, newUpload, editClientButInsert) => {
  if (newUpload) {
    return {
      apiUrl: dynamicUrl.insertCaseUrl,
      payloadData: newData
    }
  } else {
    if (existingData !== "N.A.") {
      return {
        apiUrl: dynamicUrl.updateCasesUrl,
        payloadData: {
          ...existingData,
          ...newData
        }
      }
    } else {
      if (editClientButInsert) {
        return {
          apiUrl: dynamicUrl.insertCaseUrl,
          payloadData: newData
        }
      } else {
        return {
          apiUrl: dynamicUrl.updateCasesUrl,
          payloadData: newData
        }
      }
    }
  }
}