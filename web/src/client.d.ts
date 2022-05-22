import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from "openapi-client-axios";

declare namespace Components {
  namespace Schemas {
    export interface AnalyzeUrlDto {
      /**
       * URL passed to youtube-dl --get-video
       * example:
       * https://www.youtube.com/watch?v=dQw4w9WgXcQ
       */
      url: string;
    }
    export interface Clip {
      url: string;
      start: number;
      end: number;
      output: string;
    }
    export interface CreateClipDto {
      /**
       * URL passed to youtube-dl --get-video
       * example:
       * https://www.youtube.com/watch?v=dQw4w9WgXcQ
       */
      url: string;
      /**
       * Start time in milliseconds
       * example:
       * 0
       */
      start: number;
      /**
       * End time in milliseconds
       * example:
       * 1000
       */
      end: number;
      /**
       * Output file name
       * example:
       * output.mp4
       */
      output: string;
    }
    export interface UpdateClipDto {}
  }
}
declare namespace Paths {
  namespace AnalyzeControllerAnalyze {
    export type RequestBody = Components.Schemas.AnalyzeUrlDto;
    namespace Responses {
      export type $200 = string[];
      export type $201 = string[];
    }
  }
  namespace AppControllerGetStatus {
    namespace Responses {
      export type $200 = string;
    }
  }
  namespace ClipsControllerCreate {
    export type RequestBody = Components.Schemas.CreateClipDto;
    namespace Responses {
      export type $201 = Components.Schemas.Clip;
    }
  }
  namespace ClipsControllerFindAll {
    namespace Responses {
      export type $200 = Components.Schemas.Clip[];
    }
  }
  namespace ClipsControllerFindOne {
    namespace Parameters {
      export type Id = string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export type $200 = Components.Schemas.Clip;
    }
  }
  namespace ClipsControllerProgress {
    namespace Parameters {
      export type Id = string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace ClipsControllerRemove {
    namespace Parameters {
      export type Id = string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace ClipsControllerUpdate {
    namespace Parameters {
      export type Id = string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.UpdateClipDto;
    namespace Responses {
      export type $200 = Components.Schemas.Clip;
      export type $204 = Components.Schemas.Clip;
    }
  }
}

export interface OperationMethods {
  /**
   * AppController_getStatus
   */
  "AppController_getStatus"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.AppControllerGetStatus.Responses.$200>;
  /**
   * AnalyzeController_analyze - Parse video URL with youtube-dl
   */
  "AnalyzeController_analyze"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AnalyzeControllerAnalyze.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<
    | Paths.AnalyzeControllerAnalyze.Responses.$200
    | Paths.AnalyzeControllerAnalyze.Responses.$201
  >;
  /**
   * ClipsController_findAll - Return all clips
   */
  "ClipsController_findAll"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ClipsControllerFindAll.Responses.$200>;
  /**
   * ClipsController_create - Create a clip
   */
  "ClipsController_create"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ClipsControllerCreate.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ClipsControllerCreate.Responses.$201>;
  /**
   * ClipsController_findOne - Return a single clip
   */
  "ClipsController_findOne"(
    parameters?: Parameters<Paths.ClipsControllerFindOne.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ClipsControllerFindOne.Responses.$200>;
  /**
   * ClipsController_update - Update a clip
   */
  "ClipsController_update"(
    parameters?: Parameters<Paths.ClipsControllerUpdate.PathParameters> | null,
    data?: Paths.ClipsControllerUpdate.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<
    | Paths.ClipsControllerUpdate.Responses.$200
    | Paths.ClipsControllerUpdate.Responses.$204
  >;
  /**
   * ClipsController_remove - Delete a clip
   */
  "ClipsController_remove"(
    parameters?: Parameters<Paths.ClipsControllerRemove.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ClipsControllerRemove.Responses.$200>;
  /**
   * ClipsController_progress - Stream progress of a clip
   */
  "ClipsController_progress"(
    parameters?: Parameters<Paths.ClipsControllerProgress.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ClipsControllerProgress.Responses.$200>;
}

export interface PathsDictionary {
  ["/"]: {
    /**
     * AppController_getStatus
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AppControllerGetStatus.Responses.$200>;
  };
  ["/analyze"]: {
    /**
     * AnalyzeController_analyze - Parse video URL with youtube-dl
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AnalyzeControllerAnalyze.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<
      | Paths.AnalyzeControllerAnalyze.Responses.$200
      | Paths.AnalyzeControllerAnalyze.Responses.$201
    >;
  };
  ["/clips"]: {
    /**
     * ClipsController_create - Create a clip
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ClipsControllerCreate.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ClipsControllerCreate.Responses.$201>;
    /**
     * ClipsController_findAll - Return all clips
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ClipsControllerFindAll.Responses.$200>;
  };
  ["/clips/{id}"]: {
    /**
     * ClipsController_findOne - Return a single clip
     */
    "get"(
      parameters?: Parameters<Paths.ClipsControllerFindOne.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ClipsControllerFindOne.Responses.$200>;
    /**
     * ClipsController_update - Update a clip
     */
    "patch"(
      parameters?: Parameters<Paths.ClipsControllerUpdate.PathParameters> | null,
      data?: Paths.ClipsControllerUpdate.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<
      | Paths.ClipsControllerUpdate.Responses.$200
      | Paths.ClipsControllerUpdate.Responses.$204
    >;
    /**
     * ClipsController_remove - Delete a clip
     */
    "delete"(
      parameters?: Parameters<Paths.ClipsControllerRemove.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ClipsControllerRemove.Responses.$200>;
  };
  ["/clips/{id}/progress"]: {
    /**
     * ClipsController_progress - Stream progress of a clip
     */
    "get"(
      parameters?: Parameters<Paths.ClipsControllerProgress.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ClipsControllerProgress.Responses.$200>;
  };
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>;
