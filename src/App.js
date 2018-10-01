/*jshint esversion: 6 */
import React, { Component } from 'react';
import {BrowserRouter,Route,NavLink,Switch,Redirect} from 'react-router-dom';
import axios from 'axios';
import './index.css';
import apiKey from './config';

import Gallery from './components/Gallery';
import NotFound from './components/NotFound';
import Search from './components/Search';
import NoPhotos from './components/NoPhotos';


class App extends Component {

  constructor() {
    super();
    this.state = {
      photos: [],
      loading:true,
      query: "",
    };
  }

  setStateToTrue(){
    if(!this.state.loading){
      this.setState({loading:true});
    }
  }

  //this function makes the request to flickr
  //it sets the state to hold photos it fetches and also turns off the loading indicator when it's done
  getPhotos (query) { 
    const myKey = apiKey;
    this.setStateToTrue();
    
    axios.get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${myKey}&tags=${query}&per_page=24&format=json&nojsoncallback=1`)
      .then(response => {
        this.setState({
          photos: response.data.photos.photo,
          query: query,
          loading: false,
        });
      })
      .catch(error => {
        console.log('There was a problem gettting the data', error);
      });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <div className="container">
            <Search history={this.props.history} onSearch={this.getPhotos.bind(this)} />
            <nav className="main-nav"> 
              {/* Nav links*/} 
              <ul>
                <li><NavLink to="/cats">Cats</NavLink></li>
                <li><NavLink to="/dogs">Dogs</NavLink></li>
                <li><NavLink to="/hamsters">Hamsters</NavLink></li>
              </ul>
            </nav>

            <div className="photo-container">
              <h2>{this.state.query}</h2>
              <Switch>
                {/* Redirects so opening page for first time displays results */} 
                <Redirect from="/" to="cats" exact/>
                {/* Route for the search bar searches*/} 
                <Route exact path="/search=:query" render={ ({match}) => 
                  {
                    let currentUrl= match.params.query;
                    if(currentUrl !== this.state.query){
                        this.getPhotos(currentUrl); 
                      }
                    return(
                      //if there are no photos in the array(IE no matches), returns the nophotos component
                    (this.state.photos.length !== 0)
                      ? <Gallery title={currentUrl} data={this.state.photos} loading={this.state.loading} />
                      : <NoPhotos />
                    )
                    
                  } 

                } />
                {/* This route is for the nav links*/} 
               <Route exact path="/:query" render={ ({match}) => 
                  {
                    //this gets the photos relating to current url. the if statement makes sure it only runs once
                    let currentUrl= match.params.query;
                    const navItems = ["cats","dogs","hamsters"];

                    if(navItems.indexOf(currentUrl) > -1){
                      if(currentUrl !== this.state.query){
                        this.getPhotos(currentUrl); 
                      }
                    }
                    //if the url is not one of nav items, it will return the error not found component
                    return(
                      (navItems.indexOf(currentUrl) > -1)
                        ? <Gallery data={this.state.photos} loading={this.state.loading}/>
                        : <NotFound />
                    );
                  } 
                }/>
              </Switch>
            </div>
          </div>
        </div>
      </BrowserRouter>

    );
  }
}

export default App;
