import { EmailFromat } from "./types";

/**these types are aliases of strings. they are used to enhance readability rather than to enforce types */
type Email = string;
type Domain = string;

function isAlphabetic (name: string):boolean{
    return /^[a-zA-Z()]+$/.test(name);
}

export function isValidName (name: string): boolean{
    const nameTokens = name.split(' ');
    if(nameTokens.length>2) return false;
    const [firstName, lastName] = nameTokens;
    return  !!firstName && !!lastName && 
            isAlphabetic(firstName) && isAlphabetic(lastName); 
}

export function isValidDomain (domain: string): boolean{
    const [domainName, topLevelDomain] = domain.split('.');

    if (!!domain && !!domainName && !!topLevelDomain &&
        isAlphabetic(domainName) && isAlphabetic(topLevelDomain)
        ) return true;

    return false
}

function getDomain (email: string): Domain {
    const domain = email.split('@')[1];
    
    if (isValidDomain(domain))
        return domain

    throw new Error(`Dataset Parsing Error: entry with email "${email}" has a faulty domain`);
}

function getEmailStandardFormat (name: string, domain: Domain): Email{
    const username = name.toLowerCase().replace(' ', '');
    return username + "@" + domain;
}

function getEmailReducedFormat (name: string, domain: Domain): Email{
    
    if(!isValidName(name))
        throw new Error (`Dataset Parsing Error: "${name}" is not a valid name.`);
    
    const [firstName, lastName] = name.toLowerCase().split(' ');
    const firstLetter = firstName[0].toLowerCase();
    
    return firstLetter + lastName + "@" + domain;
}

export function getEmailFormat (email:string, name:string):EmailFromat {
    
    const domain = getDomain(email);

    if(getEmailStandardFormat(name, domain) === email) 
        return EmailFromat.StandardFormat;
    
    if(getEmailReducedFormat(name, domain) === email) 
        return EmailFromat.ReducedFormat
    
    throw new Error(`Dataset Parsing Error: entry "${name}": "${email}" doesn't correspond to any Email Format`);
}

export const mapDomainsToEmailFormats= (dataset: Object):Map<string, EmailFromat>=>{
    const domainToEmailFormatMap = new Map<string, EmailFromat>();
    Object.entries(dataset).forEach(
        ([name, email])=>{

            const domain = getDomain(email);
            const emailFormat = getEmailFormat(email, name);
            
            if(domainToEmailFormatMap.has(domain)){
                if( emailFormat!==domainToEmailFormatMap.get(domain) )
                    throw new Error(`Dataset Parsing Error: domain "${domain}" is mapped to two different email formats.`);
            } else { 
                domainToEmailFormatMap.set(domain, emailFormat);
            }
        }
    )

    return domainToEmailFormatMap;
};

export function generateEmail(name:string, domain: string, emailFormat: EmailFromat):string{
    switch (emailFormat){
        case EmailFromat.StandardFormat:
            return getEmailStandardFormat(name, domain);
        case EmailFromat.ReducedFormat:
            return getEmailReducedFormat(name, domain);
    }
}