export interface Subscription {
    id: number;
    updated_from_linkedin: Date;
    full_name: string;
    first_name: string;
    last_name: string;
    current_position: string;
    Field1: string;
    person_linkedin_url: string;
    company_name: string;
    person_city: string;
    person_state: string;
    person_country: string;
    person_industry: string;
    tags: string;
    company_website: string;
    emails: {email:string,id:number}[];
    phones:string[];
    person_facebook_url: string;
    company_linkedin_url: string;
    created_by: string;
    lead_status: string;
}