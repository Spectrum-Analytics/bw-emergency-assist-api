import { Request, Response } from 'express';
import { Controller } from '../types/controller';
import { LoggerFactory } from '../factories/logger-factory';
import { EmergencyService } from '../services/core/emergency-service';

/**
 * EmergencyAssistController handles requests related to emergency incidents and contacts.
 */
class EmergencyAssistController extends Controller {
  constructor(protected service: EmergencyService, loggerFactory: LoggerFactory) {
    super(loggerFactory.getNamedLogger('emergency-assist-controller'));
  }

  /**
   * Sets up all routes for Emergency Assist endpoints.
   */
  public setRoutes(): void {
    this.logger.info('Setting up routes for Emergency Assist Controller');

    // Incident routes
    this.router.post('/incident/create', this.createIncident.bind(this));
    this.router.get('/incident/:incidentId', this.getIncidentById.bind(this));
    this.router.put('/incident/:incidentId', this.updateIncident.bind(this));
    this.router.delete('/incident/:incidentId', this.deleteIncident.bind(this));
    //this.router.get('/incidents/location', this.getIncidentsByLocation.bind(this));
    this.router.get('/incidents/person/:personId', this.listIncidents.bind(this));

    // Emergency Contact routes
    this.router.post('/contact/create', this.createEmergencyContact.bind(this));
    this.router.get('/contact/:contactId', this.getEmergencyContactById.bind(this));
    this.router.put('/contact/:contactId', this.updateEmergencyContact.bind(this));
    this.router.delete('/contact/:contactId', this.deleteEmergencyContact.bind(this));
    this.router.get('/contacts', this.listEmergencyContacts.bind(this));
  //  this.router.get('/contacts/location', this.getContactsByLocation.bind(this));
  }

  // Incident Handlers

  /**
   * Creates a new incident.
   */
  public async createIncident(request: Request, response: Response): Promise<Response> {
    const incidentData = request.body;
    const handleError = (error: any) => this.handleError(response, error);
    const sendResponse = (data: any) => this.sendResponse(response, data);

    if (!incidentData) {
      return handleError({ code: 400, message: 'Incident data is required.' });
    }

    return this.service
      .createIncident(incidentData)
      .then((incident:any) => sendResponse({ message: 'Incident created successfully', incident }))
      .catch(handleError);
  }

  /**
   * Retrieves an incident by its ID.
   */
  public async getIncidentById(request: Request, response: Response): Promise<Response> {
    const { incidentId } = request.params;
    const handleError = (error: any) => this.handleError(response, error);
    const sendResponse = (data: any) => this.sendResponse(response, data);

    if (!incidentId) {
      return handleError({ code: 400, message: 'Incident ID is required.' });
    }

    return this.service
      .getIncidentById(incidentId)
      .then((incident:any) => sendResponse(incident))
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

  // Emergency Contact Handlers

  /**
   * Creates a new emergency contact.
   */
  public async createEmergencyContact(request: Request, response: Response): Promise<Response> {
    const contactData = request.body;
    const handleError = (error: any) => this.handleError(response, error);
    const sendResponse = (data: any) => this.sendResponse(response, data);

    if (!contactData) {
      return handleError({ code: 400, message: 'Contact data is required.' });
    }

    return this.service
      .createEmergencyContact(contactData)
      .then((contact: any) => sendResponse({ message: 'Emergency contact created successfully', contact }))
      .catch(handleError);
  }

  /**
   * Retrieves an emergency contact by its ID.
   */
  public async getEmergencyContactById(request: Request, response: Response): Promise<Response> {
    const { contactId } = request.params;
    const handleError = (error: any) => this.handleError(response, error);
    const sendResponse = (data: any) => this.sendResponse(response, data);

    if (!contactId) {
      return handleError({ code: 400, message: 'Contact ID is required.' });
    }

    return this.service
      .getEmergencyContactById(contactId)
      .then((contact:any) => sendResponse(contact))
      .catch(handleError);
  }

  /**
   * Updates an existing emergency contact.
   */
  public async updateEmergencyContact(request: Request, response: Response): Promise<Response> {
    const { contactId } = request.params;
    const updates = request.body;
    const handleError = (error: any) => this.handleError(response, error);
    const sendResponse = (data: any) => this.sendResponse(response, data);

    if (!contactId) {
      return handleError({ code: 400, message: 'Contact ID is required.' });
    }

    return this.service
      .updateEmergencyContact(contactId, updates)
      .then((contact:any) => sendResponse({ message: 'Emergency contact updated successfully', contact }))
      .catch(handleError);
  }

  /**
   * Deletes an emergency contact.
   */
  public async deleteEmergencyContact(request: Request, response: Response): Promise<Response> {
    const { contactId } = request.params;
    const handleError = (error: any) => this.handleError(response, error);
    const sendResponse = (data: any) => this.sendResponse(response, data);

    if (!contactId) {
      return handleError({ code: 400, message: 'Contact ID is required.' });
    }

    return this.service
      .deleteEmergencyContact(contactId)
      .then(() => sendResponse({ message: 'Emergency contact deleted successfully' }))
      .catch(handleError);
  }

  /**
   * Lists emergency contacts with optional pagination.
   */
  public async listEmergencyContacts(request: Request, response: Response): Promise<Response> {
    const { limit, startAfter } = request.query;
    const handleError = (error: any) => this.handleError(response, error);
    const sendResponse = (data: any) => this.sendResponse(response, data);

    const parsedLimit = parseInt(limit as string, 10) || 10;
    return this.service
      .listEmergencyContacts(parsedLimit, startAfter as string)
      .then((contacts:any) => sendResponse(contacts))
      .catch(handleError);
  }

  /**
   * Retrieves emergency contacts near a specific location.
   */
  // public async getContactsByLocation(request: Request, response: Response): Promise<Response> {
  //   const { lat, lng, radius } = request.query;
  //   const handleError = (error: any) => this.handleError(response, error);
  //   const sendResponse = (data: any) => this.sendResponse(response, data);

  //   if (!lat || !lng) {
  //     return handleError({ code: 400, message: 'Latitude and longitude are required.' });
  //   }

  //   const searchRadius = radius ? parseFloat(radius as string) : 50;
  //   return this.service
  //     .getContactsByLocation({ lat: parseFloat(lat as string), lng: parseFloat(lng as string) }, searchRadius)
  //     .then((contacts:any) => sendResponse(contacts))
  //     .catch(handleError);
  // }

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

export { EmergencyAssistController };
