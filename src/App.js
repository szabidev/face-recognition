import Navigation from "./components/navigation/Navigation";
import Logo from "./components/logo/Logo";
import ImageLinkForm from "./components/imagelinkform/ImageLinkForm";
import Rank from "./components/rank/Rank";
import FaceRecognition from "./components/facerecognition/FaceRecognition";
import ParticlesBg from "particles-bg";
import "./App.css";
import { useEffect, useState } from "react";
import SignIn from "./components/signin/SignIn";
import Register from "./components/register/Register";

function App() {
  const [inputString, setInputString] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [box, setBox] = useState({});
  const [route, setRoute] = useState("signin");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  });

  useEffect(() => {
    fetch("http://localhost:3000/")
      .then((response) => response.json())
      .then((data) => console.log(data));
  }, []);

  const onInputChange = (event) => {
    console.log(event.target.value);
    setInputString(event.target.value);
  };

  const setupClarifai = (imageURL) => {
    const PAT = "5cb7d792747e48a0ba76624df9de56c2";
    const USER_ID = "szabidev";
    const APP_ID = "face-recognition";

    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: imageURL,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
      body: raw,
    };

    return requestOptions;
  };

  const calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  const displayFaceBox = (box) => {
    setBox(box);
  };

  const onPictureSubmit = () => {
    setImageURL(inputString);

    fetch(
      "https://api.clarifai.com/v2/models/face-detection/outputs",
      setupClarifai(inputString)
    )
      .then((response) => response.json())
      .then((result) => {
        if (result) {
          fetch("http://localhost:3000/image", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: user.id,
            }),
          });
        }
        displayFaceBox(calculateFaceLocation(result));
      })
      // .then((response) => response.json())
      .then((count) => {
        setUser(Object.assign(user, { entries: count }));
      })
      .catch((error) => console.log("error", error));
  };

  const onRouteChange = (route) => {
    if (route === "signout") {
      setIsSignedIn(false);
    } else if (route === "home") {
      setIsSignedIn(true);
    }
    setRoute(route);
  };

  const loadUser = (user) => {
    setUser(user);
  };

  return (
    <div className="App">
      <ParticlesBg type="circle" bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {route === "home" ? (
        <div>
          <Logo />
          <Rank user={user} />
          <ImageLinkForm
            onInputChange={onInputChange}
            onPictureSubmit={onPictureSubmit}
            inputString={inputString}
          />
          <FaceRecognition imageURL={imageURL} box={box} />
        </div>
      ) : route === "signin" ? (
        <SignIn onRouteChange={onRouteChange} loadUser={loadUser} />
      ) : (
        <Register onRouteChange={onRouteChange} loadUser={loadUser} />
      )}
    </div>
  );
}

export default App;
