require('normalize.css/normalize.css');
require('styles/Main.scss');
// require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom'

let yeomanImage = require('../images/yeoman.png');
let imageDatas = require('../datas/imageDatas.json')
function getImageURL(imageDatas){
  for(var i = 0;i < imageDatas.length;i++){
    var singleImageData= imageDatas[i];
    imageDatas[i]['imageURL'] = require('../images/'+singleImageData.fileName);
  }
  return imageDatas;
}
imageDatas = getImageURL(imageDatas);

function get30DegRandom(){
  return ((Math.random()>0.5?'':'-')+Math.ceil(Math.random()*30));
}
function getRangeRandom(low,high){
  return Math.ceil(Math.random()*(high - low) + low);
}
class ImgFigure extends React.Component{
  //imgfiguer 的点击处理函数
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e){
    this.props.reverse()
    e.stopPropagation();
    e.preventDefault();
    // console.log('reverse',this)
  }
  render(){
    var styleObj = {};
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }
    if(this.props.arrange.rotate){
      (['Moz','Wekit','Ms','']).forEach(function(value){
        styleObj[value+'transform']='rotate('+this.props.arrange.rotate+'deg)';
      }.bind(this));
    }
    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isReverse?' is-reverse':'';

    return(
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.datas.imageURL}
          alt={this.props.datas.title}
        />
        <figcaption>
          <h2 className="img-title">{this.props.datas.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.datas.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
};

class GalleryByReact extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      imgsArrageArr:[
     /*
     {
          pos:{
            left:'0',
            top:'0'
          },
          rotate:0,
          isReverse:false //图片正反面，false 未翻转是正面
        },
     */
      ],
      Constant:{
        centerPos:{/* 中心位置 */
          left:0,
          right:0
        },
        hPosRange:{         //水平方向
          leftSecX:[0,0],   /*左分区x的取值范围*/
          rightSecX:[0,0],  /*右分区x的取值范围*/
          y:[0,0]/*y的取值范围*/
        },
        vPosRange:{/*垂直方向的取值范围*/
          x:[0,0],
          topY:[0,0]
        }
      }
    }
  }
  //翻转图片，@params index 当前操作图片的index @return {funtion},
  // 这是一个闭包函数，return 一个真正的带被执行的翻转函数
  reverse(index){
    return function(){
      var imgsArrageArr = this.state.imgsArrageArr;
      imgsArrageArr[index].isReverse = !imgsArrageArr[index].isReverse;
      this.setState({
        imgsArrageArr:imgsArrageArr
      })
    }.bind(this);
  }
  componentDidMount(){
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage);
    var  stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW/2),
      halfStageH = Math.ceil(stageH/2);
      /*拿到第一个image  figuer 的大小*/
      var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
      var imgW = imgFigureDOM.scrollWidth;
      var imgH = imgFigureDOM.scrollHeight;
      var halfImgW = Math.ceil(imgW/2),
          halfImgH = Math.ceil(imgH/2);

      /* 计算中心图片的位置 */
      this.state.Constant.centerPos = {
        left: halfStageW - halfImgW,
        top: halfStageH - halfImgH,
      }
      /*
      calculate the left and right position
      */
      this.state.Constant.hPosRange.leftSecX[0] = -halfImgW;
      this.state.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;

      this.state.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
      this.state.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

      this.state.Constant.hPosRange.y[0] = -halfImgH;
      this.state.Constant.hPosRange.y[1] = stageH - halfImgH;
      /*
      calculate the top section positon of picture
      */
      this.state.Constant.vPosRange.topY[0] = -halfImgH;
      this.state.Constant.vPosRange.topY[1] = halfStageH - (halfImgH * 3);
      this.state.Constant.vPosRange.x[0] = halfStageW - imgW;
      this.state.Constant.vPosRange.x[1] = halfStageW;
      
      /*
      specific the first picture at center
      */
      this.rearrage(0);
  }
  /*用来指定需要居中的index || to specify the index that needs to be in the center
    Rearrage all pictures
  */
  rearrage(centerIndex){
    var imgsArrageArr = this.state.imgsArrageArr;
    var Constant = this.state.Constant;
    var centerPos = Constant.centerPos;
    var hPosRange = Constant.hPosRange;
    var vPosRange = Constant.vPosRange;
    var hPosRangeLeftSecX = hPosRange.leftSecX;
    var hPosRangeRightSecX = hPosRange.rightSecX;
    var hPosRangeY = hPosRange.y;
    var vPosRangeTopY = vPosRange.topY;
    var vPosRangeX = vPosRange.x;
    /* store the top section picture state ,select 0 or 2 picture at topsection*/
    var imgsArrageTopArr = [];
    var topImgNum = Math.ceil(Math.random()*2);

    /* sign the picture index of topSection */
    var topImgSpliceIndex = 0;
    var imgsArragesCenterArr = imgsArrageArr.splice(centerIndex,1)

    /* first place the picture at center */
    imgsArragesCenterArr[0].pos = centerPos;
    imgsArragesCenterArr[0].rotate = 0;
    
    /* get the picture info of top section */
    topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrageArr.length-topImgNum));
    imgsArrageTopArr = imgsArrageArr.splice(topImgSpliceIndex,topImgNum);
    /*布局位于上侧的图片*/
    imgsArrageTopArr.forEach(function(value,index){
      imgsArrageTopArr[index] = {
        pos:{
          top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
          left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])  
        },
        rotate:get30DegRandom()
      }
    })
    console.log(imgsArrageTopArr)
    /*布局左右两侧的图片*/
    var k = 0;
    for(var i = 0;k = imgsArrageArr.length/2, i < imgsArrageArr.length;i++){
      var hPosRangeLORX = null;
      /* i < k 布局在左边 否则布局在右边 */
      if(i < k){
        hPosRangeLORX = hPosRangeLeftSecX;
      }else{
        hPosRangeLORX = hPosRangeRightSecX;
      }
      imgsArrageArr[i] = {
        pos:{
          top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
          left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
        },
        rotate:get30DegRandom()
      }
    }
    if(imgsArrageTopArr && imgsArrageTopArr[0]){
      imgsArrageArr.splice(topImgSpliceIndex,0,imgsArrageTopArr[0]);
    }
    imgsArrageArr.splice(centerIndex,0,imgsArragesCenterArr[0]);
    this.setState({
      imgsArrageArr:imgsArrageArr
    });
  }
  render(){
    var controllerUnits = [];
    var ImgFigures = [];
    imageDatas.forEach(function(value,index){
      if(!this.state.imgsArrageArr[index]){
        this.state.imgsArrageArr[index] = {
          pos:{
            left:0,
            top:0
          },
          rotate:0,
          isReverse:false
        }
      }
      ImgFigures.push(<ImgFigure datas={value} key={"img"+index} ref={'imgFigure'+index}
       arrange={this.state.imgsArrageArr[index]} reverse={this.reverse(index)}/>);
    }.bind(this));/*call react funtion in foreach*/
    return (
      <section className = "stage" ref="stage">
        <section className="img-sec">
          {ImgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    )
  }
};

// AppComponent.defaultProps = {
// };

// export default AppComponent;
export default GalleryByReact;
