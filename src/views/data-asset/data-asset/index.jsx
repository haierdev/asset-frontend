import React, { useState, useEffect, useMemo } from "react";
import DataAssetComponent from "./DataAssetComponent";
export const longUsageFormater = (data) => {
   const { long_usage } = data
   const year = !!long_usage?.y && !!long_usage?.y !== 0 ? `${long_usage?.y} Years, ` : ''
   const month = !!long_usage?.m && !!long_usage?.m !== 0 ? `${long_usage?.m} Months, ` : ''
   const day = !!long_usage?.d && !!long_usage?.d !== 0 ? `${long_usage?.d} Days` : ''
   return `${year}${month}${day}`
}
const Index = () => {
   return (
      <div className="main-content mb-5">
         <div className="page-content">
            <DataAssetComponent title="Data Asset" type='input' />
         </div>
      </div>
   )
};

export default Index;
