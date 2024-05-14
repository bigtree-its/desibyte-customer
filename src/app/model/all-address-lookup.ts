export class APITierResponse{
    status: string;
    message: string;
    noOfItems: number;
    result: APITierResult;
}

export class APITierResult{
    postcode: string;
    district: string;
    ward: string;
    county: string;
    country: string;
    geocode: APITierGeocode;
    addresses: APITierAddress[];
}

export class APITierGeocode{
    eastings: string;
    northings: string;
    lattitude: string;
    longitude: string;
}

export class APITierAddress{
    building_name: string;
    premise: string;
    building_number: number;
    po_box: string;
    line_1: string;
    line_2: string;
    line_3: string;
    udprn: string;
    address: string;
    postcode: string;
    postcode_type: string;
    postcode_incode: string;
    postcode_outcode: string;
    postcode_compact: string;
    post_town: string;
    dependant_locality: string;
}