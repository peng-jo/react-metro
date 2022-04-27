import React, { useState, useRef, useEffect} from "react";
import data from "../data/subInfo.json";

interface SearchProps {
  setSelectedStation: React.Dispatch<React.SetStateAction<string>>;
}


const Search: React.FC<SearchProps> = (props) => {

  const [stationList, setStationList] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeInput = () => {
    if (inputRef.current) {
        if (stationList.includes(inputRef.current.value)) {
            props.setSelectedStation(inputRef.current.value);
        }
    }
  };
  useEffect(()=>{
    const sList = data.DATA.map((data) => {
      return data.station_nm;
    });
    setStationList(sList);
  }, []);
  return (
    <div className="search">
      <input
        onChange={onChangeInput}
        ref={inputRef}
        type="text"
        className="search-input"
      />
      <i className="icon fas fa-search"></i>
    </div>
  );
};
 
export default Search;