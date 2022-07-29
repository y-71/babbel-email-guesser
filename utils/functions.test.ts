import {isValidName, getEmailFormat, mapDomainsToEmailFormats} from './functions'
import { EmailFromat } from "./types";

describe ('validating a dataset',()=>{
    describe('validating the name',()=>{
        
        it("should return true when a name valid", ()=>{
            const name = 'John Doe';
            expect(isValidName(name)).toBe(true);
        });

        it("should return false when a name is unvalid", ()=>{
            const falsyNames = ['John ', ' Doe', 'John', 'Doe', ' ', '', 'John21 Doe', 'John Doe21', "John Martin Doe"];
            falsyNames.forEach((name)=>{expect(isValidName(name)).toBe(false)});
        })
    })

    describe('getting the EmailFormat from a dataset entry',()=>{
        it("should return the correct EmailFormat", ()=>{
            
            const FirstNameLastNameTestcase =  {
                name : 'John Doe', 
                email: 'johndoe@babbel.com'
            }
            expect(getEmailFormat(FirstNameLastNameTestcase.email, FirstNameLastNameTestcase.name)).toBe(EmailFromat.StandardFormat);
        
            const FirstNameInitialLastNameTestcase =  {
                name : 'John Doe', 
                email: 'jdoe@babbel.com'
            }
            expect(getEmailFormat(FirstNameInitialLastNameTestcase.email, FirstNameInitialLastNameTestcase.name)).toBe(EmailFromat.ReducedFormat);
            
        });

        it("should throw an Error if the name doesn't correspond to any of the formats", ()=>{
            const name = 'John Doe', email='jd@babbel.com'
            expect(()=>{getEmailFormat(email, name)}).toThrow()
        })

        it("should throw an Error if the name is unvalid", ()=>{
            const name = '', email='jd@babbel.com'
            expect(()=>{getEmailFormat(email, name)}).toThrow()
        })

        it("should throw an Error if the email is unvalid", ()=>{
            const name = 'John Doe', email='jdoe@babbelcom'
            expect(()=>{getEmailFormat(email, name)}).toThrow()
        })
    })

    describe('mapping domains to email formats', ()=>{
        it('should map domains to email formats', ()=>{
            const dataset = {
                "Jane Doe": "jdoe@babbel.com",
                "David Stein": "davidstein@google.com"
            }
            const domainToEmailFormatMap = mapDomainsToEmailFormats(dataset)
            expect(domainToEmailFormatMap.get('babbel.com')).toEqual(EmailFromat.ReducedFormat);
            expect(domainToEmailFormatMap.get('google.com')).toEqual(EmailFromat.StandardFormat);
            
        })
        
        it('should throw error if a domain is mapped to different formats', ()=>{
            const dataset = {
                "Jane Doe": "jdoe@babbel.com",
                "Jay Arun": "jayarun@babbel.com"
            }
            expect(()=>{mapDomainsToEmailFormats(dataset)}).toThrow();
        })
            
    })
})