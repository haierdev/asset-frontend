import React, { Component } from 'react';

class TotalAssetNonIT extends Component {

  render() {
    return (
      <div className="card shadow-sm">
        <div className="card-body pt-4 mt-1">
          <h4 className="card-title mb-4 fs-4 fw-bold">Total Asset Non IT</h4>

          <div className="row text-left mt-5">
            <div className="col-md-10 col-10">
              <h2 className="text-bold fs-1">1.458</h2>
            </div>
            <div className="col-md-2 col-2">
              <i className='bi bi-bar-chart-fill fs-1 text-primary'></i>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default TotalAssetNonIT