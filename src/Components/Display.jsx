import React, { useEffect, useState } from 'react';
import './display.css';
import { dataRef } from '../Firebase';
import Axios from '../Axios';
import AxiosNew from '../Axios2';
import Swal from 'sweetalert2'
import { FaTemperatureLow } from "react-icons/fa";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { FcProcess } from "react-icons/fc";
import { FaHospital } from "react-icons/fa";

function Display() {
  const [temp1, setTemp1] = useState(null);
  const [temp2, setTemp2] = useState(null);
  const [temp3, setTemp3] = useState(null);
  const [temp4, setTemp4] = useState(null);
  const [temp5, setTemp5] = useState(null);
  const [breastCancerRisk, setBreastCancerRisk] = useState(false);
  const [pChance, setPChance] = useState(null);
  const [form, setForm] = useState(false);
  const [isMenstruating, setIsMenstruating] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    familyHistory: '',
    personalHistory: '',
    alcohol: '',
    menstruation: '',
    menopause: '',
    fever: '',
    cycle:''
  });

  useEffect(() => {
    const fetchDataInterval = setInterval(() => {
      getDatafromDB();
    }, 1000);
    
    return () => clearInterval(fetchDataInterval);
  }, []);

  useEffect(() => {
    // Check breast cancer risk whenever form data or temperature data changes
    if (formData.age && temp1 && temp2 && temp3 && temp4 && temp5) {
      checkBreastCancerRisk();
    }
  }, [formData, temp1, temp2, temp3, temp4, temp5]);

  const getDatafromDB = () => {
    try {
      dataRef.ref().child('test').on('value', (data) => {
        const getData = Object.values(data.val());
        setTemp1(getData[0]);
        setTemp2(getData[1]);
        setTemp3(getData[2]);
        setTemp4(getData[3]);
        setTemp5(getData[4]);  
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIsMenstruating(e.target.value === 'yes');
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const checkBreastCancerRisk = () => {
    // Convert temperatures to numbers
    const breastTemp = parseFloat(temp3);

    // Check if breast temperature is above normal range
    if (breastTemp > 36.2) {
      // Check variation in breast temperature
      const variation = breastTemp - temp2;
      if (variation >= 0.5 && variation <= 3.0) {
        // High chance of breast cancer
        setPChance("high Chance");
      } else {
        // Low chance of breast cancer
        setBreastCancerRisk(false);
      }
    } else {
      // Normal breast temperature
      setBreastCancerRisk(false);
    }
  };

  const calculateBreastCancerChance = () => {
    let chanceNo = 0;
    console.log(formData,"data")
    // Age
    const age = parseInt(formData.age);
    if (age >= 18 && age <= 39) {
      chanceNo = 0;
    } else if (age >= 40 && age <= 64) {
      chanceNo = 1;
    } else if (age >= 65) {
      chanceNo = 2;
    }
  
    // Family History
    if (formData.familyHistory === "yes") {
      chanceNo += 2;
    }
  
    // Previous Personal History
    if (formData.personalHistory === "yes") {
      chanceNo += 1;
    }
  
    // Alcohol Consumption
    if (formData.alcohol === "yes") {
      chanceNo += 1;
    }
  
    // Menstruation Menarche
    if (formData.menstruation === "before12") {
      chanceNo += 2;
    }
  
    // Menopause
    if (formData.menopause === "before55") {
      chanceNo += 2;
    }
  
    // Fever
    if (formData.fever === "yes") {
      chanceNo += 1;
    }
    if(formData.cycle==='14-28'){
      if (temp2 >= 31.5 && temp2 <= 36) {
        chanceNo += 0;
      } else {
        chanceNo += 1;
      }
      chanceNo += 0;
    }
    if(formData.cycle==='1-13'){
      if (temp2 >= 31.5 && temp2 <= 36) {
        chanceNo += 0;
      } else {
        chanceNo += 1;
      }
      chanceNo += 0;
    }
    return chanceNo;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const chanceNo = calculateBreastCancerChance();
    let chance;
    if (chanceNo >= 1 && chanceNo <= 5) {
      chance = "Low";
    } else if (chanceNo >= 6 && chanceNo <= 9) {
      chance = "Moderate";
    } else if( temp2 > 36){
      chance = "Moderate";
    } else {
      chance = "VeryHigh";
    }
    setPChance(chance);
    Swal.fire(chance);
  };

  return (
    <>
   {
  pChance ? (
    <div className='notification'>
      {pChance === "Low" && (
        <span>You Are far safe now from breast cancer <AiFillSafetyCertificate style={{color:"green",fontSize:'20'}}/></span>
      )}
      {pChance === 'moderate' && (
        <span>Your chance is moderate please use this for next 2 days <FcProcess style={{color:"green",fontSize:'20'}}/></span>
      )}
      {pChance === 'VeryHigh' && (
        <span>Your chance is High Go to nearest hospital <FaHospital style={{color:"green",fontSize:'20'}}/></span>
      )}
    </div>
  ) : (
    ""
  )
}

   
      <div className='main'>
        <div className="rate">
        <FaTemperatureLow />

          <div>
            <span>Temp 1</span>
            <h1>{temp1}</h1>
          </div>
        </div>
        <div className="temp">
          <div>
          <FaTemperatureLow />

            <span> Temp 2</span>
            <h1>{temp5}</h1>
          </div>
        </div>
        <div className="rate ">
          <div>
          <FaTemperatureLow />

            <span>Tem2</span> <br />
            <h1>{temp3}</h1>
          </div>
        </div>
        <div className="rate ">
          <div>
            
          <FaTemperatureLow />

            <span>Tem3</span> <br />
            <h1>{temp4}</h1>
          </div>
        </div>
        <div className="rate Reference">
          <div>
            <span>Reference  Temp</span> <br />
            <h1>{temp2}</h1>
          </div>
        </div>
      </div>

      <div className='secondDiv'>
        <button className='chekNow' onClick={() => setForm(true)}>Check Now</button>
        {form && (
          <form onSubmit={handleSubmit}>
            <div className="form">
              <input type="number" name="age" placeholder='Enter Your age' onChange={handleChange} /> <br />
             <span> Any Family History? </span> <br />
              <label>
                <input type="radio" name="familyHistory" value="yes" onChange={handleChange} /> Yes
              </label>
              <label>
                <input type="radio" name="familyHistory" value="no" onChange={handleChange} /> No
              </label>
              <br />
             <span> Previous Personal History? </span> <br />
              <label>
                <input type="radio" name="personalHistory" value="yes" onChange={handleChange} /> Yes
              </label>
              <label>
                <input type="radio" name="personalHistory" value="no" onChange={handleChange} /> No
              </label>
              <br />
             <span> Do you drink Alcohol? </span><br />
              <label> 
                <input type="radio" name="alcohol" value="yes" onChange={handleChange} /> Yes
              </label>
              <label>
                <input type="radio" name="alcohol" value="no" onChange={handleChange} /> No
              </label>
              <br />
                <span> Menstruation Menarche</span> <br />
              <select name="menstruation" onChange={handleChange}>
                <option value="before12">Before 12 years</option>
                <option value="after12">After 12 years</option>
              </select>
              <br />
              <span>Menopause</span> <br />
              <select name="menopause" onChange={handleChange}>
                <option value="after55">After 55 years</option>
                <option value="before55">Before 55 years</option>
                <option value="before55">Not yet</option>
              </select>
              <br />
             <span> Menstrual cycle </span><br />
              <select name="cycle" onChange={handleChange}>
                <option value="1-13">1 - 13</option>
                <option value="14-28">14 - 28</option>
              </select>
              <br />
              <span> Menstruating now?</span> <br />
              <label> 
                <input type="radio" name="mensturation" value="yes" onChange={handleChange} /> Yes
              </label>
              <label>
                <input type="radio" name="mensturation" value="no" onChange={handleChange} /> No
              </label>
              {isMenstruating && (
                <div>
                  <label style={{color:'rgb(21, 240, 40)'}}>
                    Enter the date of cycle :
                    <input type="text" placeholder='ex:7' />
                  </label>
                </div>
              )}
           <br />   <span> Do you have Fever currently?</span> <br />
           
              <label> 
                <input type="radio" name="fever" value="yes" onChange={handleChange} /> Yes
              </label>
              <label>
                <input type="radio" name="fever" value="no" onChange={handleChange} /> No
              </label>
              <br />
              <button type="submit" className='btnSub'>View Result</button>
            </div>
          </form>
        )}
      </div>
     
    </>
  );
}

export default Display;
