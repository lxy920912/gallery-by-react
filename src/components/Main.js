require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');
let imageDatas = require('../datas/imageDatas.json')
function getImageURL(imageDatas){
  for(var i = 0;i < imageDatas.length;i++){
    var singleImageData= imageDatas[i];
    imageDatas[i] = require('../images/'+singleImageData.name);
  }
  return imageDatas;
}
imageDatas = getImageURL(imageDatas);
class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      </div>
    );
  }
}

class GalleryByReact extends React.Component{
  render(){
    return (
      <section className = "stage">
        <section className="img-sec">
        </section>
        <nav className="controller-nav"></nav>
      </section>
    )
  }
}

AppComponent.defaultProps = {
};

// export default AppComponent;
export default GalleryByReact;
