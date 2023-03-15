import React,{useState,useRef,useEffect} from 'react'
import "./App.css";

function App() {
  const [value,setValue]= useState()
  const [encodeString,setEncodeString]= useState()
  const [decodeString,setDecodeString]= useState()
  const [key,setKey]= useState()
  const eachCharLen= 5

  const elm=['space','<','>','-','_','!','^','+','%','&','/','(',')','=','?',
    'ü','ş','ö','æ','ß','€','£','$','₺',',','.','@',
    'a','b','c','d','e','f','g','h','i','j','k','l','m',
    'n','o','p','q','r','s','t','u','v','w','x','y','z',
  ]
  const messageRef = useRef('');
 
  async function resetMessage(param){
    setValue('')
    setEncodeString(null)
    setDecodeString(null)
  }

  async function updateChiperText(param){
    try{
      const response= await encodedString(param)
      setEncodeString(response)
      const decode= await decodedString(response,param)
      setDecodeString(decode)
    }catch(e){
      console.log(e)
    }
  }

  async function handleMissing(codeLen,len){
    try{
          const dif= codeLen - len
          const addedNr= await Promise.all(
            Array.from(Array(dif).keys()).map( async ()=>{
              return Math.floor(Math.random()*10).toString()
            })
          )
          const joined= addedNr.join('')
          return joined      
    }catch(e){
      console.log(e)
    }
  }
  async function createKey(charLen){
    try{
        let obj={}
        const codeLen=charLen
        await Promise.all(elm.map( async (val,ind) => {
            let randomNr= Math.random()*10**codeLen
            let codedNr= Math.round(randomNr).toString()
            if(!obj[val]) obj[val]={value:val,initial:codedNr,add:null}
            if(val=='space') obj[val]={...obj[val],value:' '}
            
            const len= codedNr.toString().length       
            if(len<codeLen) obj[val].add= await handleMissing(codeLen,len)
            
            const initialString= obj[val].initial
            const addedString=  obj[val].add==null? '':obj[val].add
            obj[val].code= initialString+addedString
        }))
        setKey(obj)
    }catch(e){
      console.log(e)
    }
  }

  async function handleKeyObj(param){
    try{
      const chiperObj={}
      await Promise.all(Object.keys(param)?.map((val) => {
        if(chiperObj[val] === undefined && val !== " "){
          chiperObj[val]= param[val].code
        }
      }))
      return chiperObj
    }catch(e){
      console.log(e)
    }
  }

  async function fetchVal(param,key){
    try{
        let response=null      
        await Promise.all(Object.keys(key).map(item => {
          if(key[item].code==param){
            response=key[item].value
          }
        }))
        return response
    }catch(e){
      console.log(e)
    }
  }

  async function decodedString(str,key){
    try{
      const splitted= str.match(/.{5}/g)
      const output= await Promise.all(
        splitted?.map( async (val) => {
          const item= await fetchVal(val,key)
          return item
        })
      )
      const response= output.join('')
      return response
    }catch(e){
      console.log(e)
    }
  }

  async function encodedString(keyParam){
    try{
      // creating the key object
      const encodedObj= await handleKeyObj(keyParam)

      // encoding the message
      const output= await Promise.all(
        Array.from(value, (val) => {
          if(val==' ') return encodedObj['space']
          else return encodedObj[val]
        })
      )
      const response= output.join('')
      return response
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    if(key && value) updateChiperText(key)
  },[key,value])

  useEffect(() => {
    createKey(eachCharLen)
  },[])
  
  return (
    <div className={"main"}>
      
      <div className="inputContainer"> 
        <h3 className="header">Enter Message to be encoded</h3>  
        <textarea 
          className="input"
          type="text" 
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </div>
        <button onClick={() => resetMessage()} className="reset">Reset</button>
      
      <div className="responseContainer">
        {value && <>
          <h2 className="title">Message</h2><h3 className="text">{value}</h3>
        </>}
        {encodeString && <>
          <h2 className="title">Encode</h2><h3 className="text">{encodeString}</h3>
        </>}
        {decodeString && <>
          <h2 className="title">Decode</h2><h3 className="text">{decodeString}</h3>
        </>}
      </div>

    </div>
  );
}

export default App;
