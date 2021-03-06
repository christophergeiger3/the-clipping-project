/**
 * Generated by orval v6.8.1 🍺
 * Do not edit manually.
 * The Clipping Project API
 * An API for creating clips from video URLs
 * OpenAPI spec version: 1.0
 */
import axios,{
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from 'axios'
import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  QueryFunction,
  MutationFunction,
  UseQueryResult,
  QueryKey
} from 'react-query'
export interface UpdateClipDto { [key: string]: any }

export interface Clip {
  url: string;
  start: number;
  end: number;
  name: string;
  status: string;
  /** Resulting URL from passing clip.url to yt-dlp --get-video */
  analyzedUrl: string;
  /** Filename of the clip video, if one exists */
  filename: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClipDto {
  /** URL passed to yt-dlp --get-video */
  url: string;
  /** Start time in milliseconds */
  start: number;
  /** End time in milliseconds */
  end: number;
  /** Clip name, without extension */
  name: string;
}

export interface AnalyzeUrlDto {
  /** URL passed to youtube-dl --get-video */
  url: string;
}




export const appControllerGetStatus = (
     options?: AxiosRequestConfig
 ): Promise<AxiosResponse<string>> => {
    return axios.get(
      `/`,options
    );
  }


export const getAppControllerGetStatusQueryKey = () => [`/`];

    
export type AppControllerGetStatusQueryResult = NonNullable<Awaited<ReturnType<typeof appControllerGetStatus>>>
export type AppControllerGetStatusQueryError = AxiosError<unknown>

export const useAppControllerGetStatus = <TData = Awaited<ReturnType<typeof appControllerGetStatus>>, TError = AxiosError<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof appControllerGetStatus>>, TError, TData>, axios?: AxiosRequestConfig}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const {query: queryOptions, axios: axiosOptions} = options ?? {}

  const queryKey = queryOptions?.queryKey ?? getAppControllerGetStatusQueryKey();

  

  const queryFn: QueryFunction<Awaited<ReturnType<typeof appControllerGetStatus>>> = ({ signal }) => appControllerGetStatus({ signal, ...axiosOptions });

  const query = useQuery<Awaited<ReturnType<typeof appControllerGetStatus>>, TError, TData>(queryKey, queryFn, queryOptions)

  return {
    queryKey,
    ...query
  }
}


/**
 * @summary Parse video URL with youtube-dl
 */
export const analyzeControllerAnalyze = (
    analyzeUrlDto: AnalyzeUrlDto, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<string[]>> => {
    return axios.post(
      `/analyze`,
      analyzeUrlDto,options
    );
  }



    export type AnalyzeControllerAnalyzeMutationResult = NonNullable<Awaited<ReturnType<typeof analyzeControllerAnalyze>>>
    export type AnalyzeControllerAnalyzeMutationBody = AnalyzeUrlDto
    export type AnalyzeControllerAnalyzeMutationError = AxiosError<void>

    export const useAnalyzeControllerAnalyze = <TError = AxiosError<void>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof analyzeControllerAnalyze>>, TError,{data: AnalyzeUrlDto}, TContext>, axios?: AxiosRequestConfig}
) => {
      const {mutation: mutationOptions, axios: axiosOptions} = options ?? {}

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof analyzeControllerAnalyze>>, {data: AnalyzeUrlDto}> = (props) => {
          const {data} = props ?? {};

          return  analyzeControllerAnalyze(data,axiosOptions)
        }

      return useMutation<Awaited<ReturnType<typeof analyzeControllerAnalyze>>, TError, {data: AnalyzeUrlDto}, TContext>(mutationFn, mutationOptions)
    }
    
/**
 * @summary Create a clip
 */
export const clipsControllerCreate = (
    createClipDto: CreateClipDto, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<Clip>> => {
    return axios.post(
      `/clips`,
      createClipDto,options
    );
  }



    export type ClipsControllerCreateMutationResult = NonNullable<Awaited<ReturnType<typeof clipsControllerCreate>>>
    export type ClipsControllerCreateMutationBody = CreateClipDto
    export type ClipsControllerCreateMutationError = AxiosError<unknown>

    export const useClipsControllerCreate = <TError = AxiosError<unknown>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof clipsControllerCreate>>, TError,{data: CreateClipDto}, TContext>, axios?: AxiosRequestConfig}
) => {
      const {mutation: mutationOptions, axios: axiosOptions} = options ?? {}

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof clipsControllerCreate>>, {data: CreateClipDto}> = (props) => {
          const {data} = props ?? {};

          return  clipsControllerCreate(data,axiosOptions)
        }

      return useMutation<Awaited<ReturnType<typeof clipsControllerCreate>>, TError, {data: CreateClipDto}, TContext>(mutationFn, mutationOptions)
    }
    
/**
 * @summary Return all clips
 */
export const clipsControllerFindAll = (
     options?: AxiosRequestConfig
 ): Promise<AxiosResponse<Clip[]>> => {
    return axios.get(
      `/clips`,options
    );
  }


export const getClipsControllerFindAllQueryKey = () => [`/clips`];

    
export type ClipsControllerFindAllQueryResult = NonNullable<Awaited<ReturnType<typeof clipsControllerFindAll>>>
export type ClipsControllerFindAllQueryError = AxiosError<unknown>

export const useClipsControllerFindAll = <TData = Awaited<ReturnType<typeof clipsControllerFindAll>>, TError = AxiosError<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof clipsControllerFindAll>>, TError, TData>, axios?: AxiosRequestConfig}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const {query: queryOptions, axios: axiosOptions} = options ?? {}

  const queryKey = queryOptions?.queryKey ?? getClipsControllerFindAllQueryKey();

  

  const queryFn: QueryFunction<Awaited<ReturnType<typeof clipsControllerFindAll>>> = ({ signal }) => clipsControllerFindAll({ signal, ...axiosOptions });

  const query = useQuery<Awaited<ReturnType<typeof clipsControllerFindAll>>, TError, TData>(queryKey, queryFn, queryOptions)

  return {
    queryKey,
    ...query
  }
}


/**
 * @summary Return a single clip
 */
export const clipsControllerFindOne = (
    id: string, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<Clip>> => {
    return axios.get(
      `/clips/${id}`,options
    );
  }


export const getClipsControllerFindOneQueryKey = (id: string,) => [`/clips/${id}`];

    
export type ClipsControllerFindOneQueryResult = NonNullable<Awaited<ReturnType<typeof clipsControllerFindOne>>>
export type ClipsControllerFindOneQueryError = AxiosError<unknown>

export const useClipsControllerFindOne = <TData = Awaited<ReturnType<typeof clipsControllerFindOne>>, TError = AxiosError<unknown>>(
 id: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof clipsControllerFindOne>>, TError, TData>, axios?: AxiosRequestConfig}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const {query: queryOptions, axios: axiosOptions} = options ?? {}

  const queryKey = queryOptions?.queryKey ?? getClipsControllerFindOneQueryKey(id);

  

  const queryFn: QueryFunction<Awaited<ReturnType<typeof clipsControllerFindOne>>> = ({ signal }) => clipsControllerFindOne(id, { signal, ...axiosOptions });

  const query = useQuery<Awaited<ReturnType<typeof clipsControllerFindOne>>, TError, TData>(queryKey, queryFn, {enabled: !!(id), ...queryOptions})

  return {
    queryKey,
    ...query
  }
}


/**
 * @summary Update a clip
 */
export const clipsControllerUpdate = (
    id: string,
    updateClipDto: UpdateClipDto, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<Clip>> => {
    return axios.patch(
      `/clips/${id}`,
      updateClipDto,options
    );
  }



    export type ClipsControllerUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof clipsControllerUpdate>>>
    export type ClipsControllerUpdateMutationBody = UpdateClipDto
    export type ClipsControllerUpdateMutationError = AxiosError<unknown>

    export const useClipsControllerUpdate = <TError = AxiosError<unknown>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof clipsControllerUpdate>>, TError,{id: string;data: UpdateClipDto}, TContext>, axios?: AxiosRequestConfig}
) => {
      const {mutation: mutationOptions, axios: axiosOptions} = options ?? {}

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof clipsControllerUpdate>>, {id: string;data: UpdateClipDto}> = (props) => {
          const {id,data} = props ?? {};

          return  clipsControllerUpdate(id,data,axiosOptions)
        }

      return useMutation<Awaited<ReturnType<typeof clipsControllerUpdate>>, TError, {id: string;data: UpdateClipDto}, TContext>(mutationFn, mutationOptions)
    }
    
/**
 * @summary Delete a clip
 */
export const clipsControllerRemove = (
    id: string, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<Clip>> => {
    return axios.delete(
      `/clips/${id}`,options
    );
  }



    export type ClipsControllerRemoveMutationResult = NonNullable<Awaited<ReturnType<typeof clipsControllerRemove>>>
    
    export type ClipsControllerRemoveMutationError = AxiosError<unknown>

    export const useClipsControllerRemove = <TError = AxiosError<unknown>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof clipsControllerRemove>>, TError,{id: string}, TContext>, axios?: AxiosRequestConfig}
) => {
      const {mutation: mutationOptions, axios: axiosOptions} = options ?? {}

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof clipsControllerRemove>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  clipsControllerRemove(id,axiosOptions)
        }

      return useMutation<Awaited<ReturnType<typeof clipsControllerRemove>>, TError, {id: string}, TContext>(mutationFn, mutationOptions)
    }
    
/**
 * @summary Stream progress of a clip as an integer from 0 - 100
 */
export const clipsControllerProgress = (
    id: string, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<void>> => {
    return axios.get(
      `/clips/${id}/progress`,options
    );
  }


export const getClipsControllerProgressQueryKey = (id: string,) => [`/clips/${id}/progress`];

    
export type ClipsControllerProgressQueryResult = NonNullable<Awaited<ReturnType<typeof clipsControllerProgress>>>
export type ClipsControllerProgressQueryError = AxiosError<unknown>

export const useClipsControllerProgress = <TData = Awaited<ReturnType<typeof clipsControllerProgress>>, TError = AxiosError<unknown>>(
 id: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof clipsControllerProgress>>, TError, TData>, axios?: AxiosRequestConfig}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const {query: queryOptions, axios: axiosOptions} = options ?? {}

  const queryKey = queryOptions?.queryKey ?? getClipsControllerProgressQueryKey(id);

  

  const queryFn: QueryFunction<Awaited<ReturnType<typeof clipsControllerProgress>>> = ({ signal }) => clipsControllerProgress(id, { signal, ...axiosOptions });

  const query = useQuery<Awaited<ReturnType<typeof clipsControllerProgress>>, TError, TData>(queryKey, queryFn, {enabled: !!(id), ...queryOptions})

  return {
    queryKey,
    ...query
  }
}


