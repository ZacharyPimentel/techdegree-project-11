import React from 'react';
import Photo from './Photo';

const Gallery = (props) => {

  const results = props.data;
  let photos;
  let loading = props.loading;
  //this takes the array of photos and turns each one into a photo compoment with a key and url to use for the page
  if(results.length >0 ){
    photos = results.map(photo =>
      <Photo key={photo.id} title={photo.title} url={`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`} />
    )
  }else{
    
  }

  //This displays the loading text until the pictures are displayed
  return(
    (loading)
    ?<p>Loading...</p>
    :<ul>{photos}</ul>
  );
};

export default Gallery;
