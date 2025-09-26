import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ApiService } from './api-service';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;
  const baseUrl = 'http://localhost:3000/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET request with query params', () => {
    const mockResponse = { data: 'test' };
    const url = 'test-get';
    const queryParams = { param1: 'value1', param2: 'value2' };

    service.commonGetMethod(url, queryParams).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(request => 
      request.method === 'GET' &&
      request.url === baseUrl + url &&
      request.params.get('param1') === 'value1' &&
      request.params.get('param2') === 'value2'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should make a POST request with data', () => {
    const mockResponse = { success: true };
    const url = 'test-post';
    const postData = { username: 'user', password: 'pass' };

    service.commonPostMethod(url, postData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(baseUrl + url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(postData);
    req.flush(mockResponse);
  });

  it('should make a PATCH request with data', () => {
    const mockResponse = { updated: true };
    const url = 'test-patch';
    const patchData = { field: 'newValue' };

    service.commonPatchMethod(url, patchData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(baseUrl + url);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(patchData);
    req.flush(mockResponse);
  });

  it('should make a DELETE request', () => {
    const mockResponse = { deleted: true };
    const url = 'test-delete';

    service.commanDeleteMethod(url).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(baseUrl + url);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
