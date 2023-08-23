import React, { useState, useEffect, useMemo } from "react";
import DataAssetComponent from "../data-asset/DataAssetComponent";
const Index = () => {
   return (
      <div className="main-content mb-5">
         <div className="page-content">
            <DataAssetComponent title="Stock Opname" type='stock-opname' />
         </div>
      </div>
   )
};

export default Index;
