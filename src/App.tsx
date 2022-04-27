import React, {useState} from "react";
import Station from "./component/Station";
import Search from "./component/Search";
import "./style/style.scss";

const App = () => {
  const [selectedStation, setSelectedStation] = useState<string>("");
  return (
    <div className="App">
      <div className="container">
        <Search setSelectedStation={setSelectedStation} />
        <Station selectedStation={selectedStation} />
      </div>
    </div>
  );
};

export default App;
