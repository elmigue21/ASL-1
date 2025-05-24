export interface Subscription {
    id: number;
    updated_from_linkedin: Date;
    first_name: string;
    last_name: string;
    person_linkedin_url: string;
    tags: string;
    // company_website: string;
    emails: {email:string,id:number}[];
    phone_numbers:{phone:string}[];
    person_facebook_url: string;
    company_linkedin_url: string;
    created_by: string;
    active_status:boolean;
    address: {country:string,state:string,city:string};
    company:{name:string,linked_in_url:string,website:string};
    occupation:string
    industry:string
    verified_status:boolean,
    archived_status:boolean,
}