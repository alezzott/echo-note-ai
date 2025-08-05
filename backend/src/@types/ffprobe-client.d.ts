declare module "ffprobe-client" {
  function ffprobe(filePath: string): Promise<any>;
  export default ffprobe;
}
