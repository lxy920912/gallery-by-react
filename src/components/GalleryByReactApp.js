class GalleryByReact extends React.Component{
  render(){
    return (
      <div className="main">
        <ReactTransitionGroup transitionName="fade">
          <img src={imageURL}/>
          <span>Hello</span>
        </ReactTransitionGroup>
      </div>
      )
  }
}