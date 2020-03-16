import { TestBed } from '@angular/core/testing';

import { OnlineofflineService } from './onlineoffline.service';

describe('OnlineofflineService', () => {
  let service: OnlineofflineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineofflineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
