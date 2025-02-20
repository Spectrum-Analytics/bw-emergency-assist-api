import { Request, Response } from 'express';
import { Controller } from '../types/controller';
import { LoggerFactory } from '../factories/logger-factory';
import { JointEffortsService } from '../services/core/joint-efforts-service';
import { PersonService } from '../services/core/person-service';
import { Person } from '../models/base/person';

/**
 * EmergencyAssistController handles requests related to emergency incidents and contacts.
 */
class JointEffortsController extends Controller {
  constructor(protected jointEffortsService: JointEffortsService, protected personService: PersonService,  loggerFactory: LoggerFactory) {
    super(loggerFactory.getNamedLogger('joint-efforts-controller'));
  }

  /**
   * Sets up all routes for Emergency Assist endpoints.
   */
  public setRoutes(): void {
    this.logger.info('Setting up routes for Emergency Assist Controller');

    // Joint Efforts routes
    this.router.post('/jointefforts/create', this.createNewVolunteer.bind(this));
    this.router.get('/jointefforts/:incidentId', this.getVolunteerById.bind(this));
    this.router.put('/incident/:incidentId', this.UpdateVolunteer.bind(this));
    this.router.delete('/incident/:incidentId', this.deleteVolunteer.bind(this));
    this.router.get('/incidents/person/:personId', this.listVolunteers.bind(this));
    
  }

  // Volunteer Handlers
  /**
   * Creates a new volunteer.
   */
  public async createNewVolunteer(request: Request, response: Response): Promise<Response> {
    const volunteerData = request.body;
    const handleError = (error: any) => this.handleError(response, error);
    const sendResponse = (data: any) => this.sendResponse(response, data);

    if (!volunteerData) {
      return handleError({ code: 400, message: 'Volunteer data is required.' });
    }

    //First check if person exists, then f not create person first, else get person
    let person = await this.personService.getPersonByPhone(volunteerData.phone);
    
    if(!person){
      person = await this.personService.createPerson(volunteerData);
    }

    return this.jointEffortsService
      .createNewVolunteer(person.id,  volunteerData)
      .then((volunteer:any) => sendResponse({ message: 'Volunteer created successfully', volunteer }))
      .catch(handleError);
  }

  /**
   * Retrieves an incident by its ID.
   */
  public async getVolunteerById(request: Request, response: Response): Promise<Response> {
    const { volunteerId } = request.params;
    const handleError = (error: any) => this.handleError(response, error);
    const sendResponse = (data: any) => this.sendResponse(response, data);

    if (!volunteerId) {
      return handleError({ code: 400, message: 'Volunteer ID is required.' });
    }

    return this.service
      .getVolunteerById(volunteerId)
      .then((volunteer:any) => sendResponse(volunteer))
      .catch(handleError);
  }

  /**
   * Updates an existing incident.
   */
  public async updateIncident(request: Request, response: Response): Promise<Response> {
    const { incidentId } = request.params;
    const updates = request.body;
    const handleError = (error: any) => this.handleError(response, error);
    const sendResponse = (data: any) => this.sendResponse(response, data);

    if (!incidentId) {
      return handleError({ code: 400, message: 'Incident ID is required.' });
    }

    return this.service
      .updateIncident(incidentId, updates)
      .then((incident:any) => sendResponse({ message: 'Incident updated successfully', incident }))
      .catch(handleError);
  }

  /**
   * Deletes an incident.
   */
  public async deleteIncident(request: Request, response: Response): Promise<Response> {
    const { incidentId } = request.params;
    const handleError = (error: any) => this.handleError(response, error);
    const sendResponse = (data: any) => this.sendResponse(response, data);

    if (!incidentId) {
      return handleError({ code: 400, message: 'Incident ID is required.' });
    }

    return this.service
      .deleteIncident(incidentId)
      .then(() => sendResponse({ message: 'Incident deleted successfully' }))
      .catch(handleError);
  }

  /**
   * Retrieves incidents near a specific location.
   */
  // public async getIncidentsByLocation(request: Request, response: Response): Promise<Response> {
  //   const { lat, lng, radius } = request.query;
  //   const handleError = (error: any) => this.handleError(response, error);
  //   const sendResponse = (data: any) => this.sendResponse(response, data);

  //   if (!lat || !lng) {
  //     return handleError({ code: 400, message: 'Latitude and longitude are required.' });
  //   }

  //   const searchRadius = radius ? parseFloat(radius as string) : 50;
  //   return this.service
  //     .getIncidentsByLocation({ lat: parseFloat(lat as string), lng: parseFloat(lng as string) }, searchRadius)
  //     .then((incidents:any) => sendResponse(incidents))
  //     .catch(handleError);
  // }

  /**
   * Lists all incidents for a given person.
   */
  public async listIncidents(request: Request, response: Response): Promise<Response> {
    const { personId } = request.params;
    const handleError = (error: any) => this.handleError(response, error);
    const sendResponse = (data: any) => this.sendResponse(response, data);

    if (!personId) {
      return handleError({ code: 400, message: 'Person ID is required.' });
    }

    return this.service
      .listIncidents(personId)
      .then((incidents:any) => sendResponse(incidents))
      .catch(handleError);
  }

 
  // Utility Methods

  /**
   * Handles errors and sends an appropriate response.
   */
  protected handleError(response: Response, error: any): Response {
    const code = error.code || 500;
    const message = error.message || 'An unexpected error occurred';
    return response
      .status(code)
      .json({
        success: false,
        code,
        timestamp: new Date().getTime(),
        errorMessage: message,
        data: null,
      });
  }

  /**
   * Sends a success response back to the client.
   */
  protected sendResponse(response: Response, data: any): Response {
    return response
      .status(200)
      .json({
        success: true,
        code: 200,
        timestamp: new Date().getTime(),
        errorMessage: null,
        data,
      });
  }
}

export { JointEffortsController };
