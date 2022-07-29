import { NextApiRequest, NextApiResponse } from 'next';
import { generateEmail, isValidDomain, isValidName, mapDomainsToEmailFormats } from 'utils/functions'
import { EmailFromat } from 'utils/types';
import dataset from '../../public/dataset.json'

const domainToEmailFomatMap = mapDomainsToEmailFormats(dataset);

type RequestBody = {
  name: string,
  domain: string
};

const validateInputs = (res: NextApiResponse<{suggestion: string}|{error: string}>, name: string, domain: string) => {
  if (!isValidName(name)){
    res.status(400).json({ error:'Bad Request: invalid name' })
  }

  if (!isValidDomain(domain)){
    res.status(400).json({ error:'Bad Request: invalid domain' })
  }
}
export default function handler(
    req:NextApiRequest, 
    res: NextApiResponse<{suggestion: string}|{error: string}>
) {
    const {name, domain} = req.body as RequestBody;
    console.log('name:', name, Object.values(req.body));
    validateInputs(res, name, domain)

    if (domainToEmailFomatMap.has(domain)) {
      const format = domainToEmailFomatMap.get(domain) as EmailFromat;
      const suggestion = generateEmail(name, domain, format)
      res.status(200).json({ suggestion })
      return;

    } else {
      res.status(404).json({error: 'the requested domain does not exist in our internal dataset'});
    }
  }