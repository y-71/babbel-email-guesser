import Head from 'next/head'
import { isValidDomain, isValidName } from 'utils/functions'
import styles from '@/pages/index.module.css'
import { useEffect, useState } from 'react';

export default function Home() {
  const [name, setName] = useState<string>(""); 
  const [domain, setDomain] = useState<string>("");

  const [isValidNameInput, setIsValidNameInput] = useState<boolean|undefined>(undefined);
  const [isValidDomainInput, setIsValidDomainInput] = useState<boolean|undefined>(undefined);
  
  const [guessedEmail, setGuessedEmail] = useState<string>("");
  const [domainNotFound, setDomainNotFound] = useState<boolean>(false);
  
  useEffect(() => {
    validateNameInput(name); 
    validateDomainInput(domain);
  }, [name, domain]);

  const validateNameInput = (name: string)=>{
    if(name === '') setIsValidNameInput(undefined);
    else if(isValidName(name)) setIsValidNameInput(true);
    else setIsValidNameInput(false);
  }
  
  const validateDomainInput = (domain: string)=>{
    if(domain === '') setIsValidDomainInput(undefined);
    else if(isValidDomain(domain)) setIsValidDomainInput(true);
    else setIsValidDomainInput(false);
  }
  
  const getInputStyle = (isValidInput:boolean|undefined)=>{
    return isValidInput!==undefined?
            (isValidInput? styles.validInput: styles.unvalidInput):''
  }

  const getSuggestion = async () =>{
    await fetch('/api/suggestion', {
      method:'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        name,
        domain 
      })
    }).then(
      (res)=>{
        if(res.status === 404)
          setDomainNotFound(true);  
        if(res.status === 200)
          return res.json();
      }).then((json)=>{
        if(json === undefined)
          return;
        setDomainNotFound(false);
        setGuessedEmail(json.suggestion);
      }
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Email Guesser</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      <div>
          <label htmlFor="name">
            Name             
          <input
                id="name"
                onChange={(e)=>setName(e.target.value)} 
                type="text" 
                placeholder='name'
                className={getInputStyle(isValidNameInput)}></input>
                <div style={{
                  visibility: isValidNameInput===false?'visible':'hidden',
                  color: 'red'
                }}
                ><p><i>Seems like your name is unvalid. A valid name must look like "John Doe"</i></p></div>
          </label>  
          
        <label htmlFor="domain">
          Domain 
        
          <input 
            id="domain" 
            onChange={(e)=>{setDomain(e.target.value)}}
            type="text" 
            placeholder='domain'
            className={getInputStyle(isValidDomainInput)}></input>
        </label>
        <div 
              className={styles.red}
              style={{
                  'visibility':isValidDomainInput===false?'visible':'hidden'
                }}><p><i>Seems like your domain is unvalid. A valid domain must look like "google.com"</i></p></div>  
        <button  
          disabled={!isValidNameInput || !isValidDomainInput} 
          onClick={getSuggestion}
          type="submit">
            Make a Guess
        </button>
      </div>
      <div>
        {domainNotFound?<div  className={styles.red}>Domain not found</div>:<div  className={styles.blue}>{guessedEmail}</div>}
      </div>
      </main>

    </div>
  )
}
