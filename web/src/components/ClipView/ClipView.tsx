import { Box, Button, Grid, TextField } from "@mui/material";
import { useCallback, useState } from "react";
import Video from "./Video";
import axios from "axios";

export default function ClipView() {
  const [url, setUrl] = useState("");
  const [filename, setFilename] = useState("");
  const [startEndTimes, setStartEndTimes] = useState<number[]>([0, 100]);
  const [videoUrl, setVideoUrl] = useState(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    // "https://rr4---sn-p5qlsndd.googlevideo.com/videoplayback?expire=1640321957&ei=Rf_EYdi_NZKJ_9EPuIO4aA&ip=38.126.102.172&id=o-AMZB91T9lYmQ3WsXXL_haUaIGph1wQStVc4PPRZwrxh1&itag=137&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278%2C394%2C395%2C396%2C397%2C398%2C399&source=youtube&requiressl=yes&mh=Qp&mm=31%2C29&mn=sn-p5qlsndd%2Csn-p5qs7nes&ms=au%2Crdu&mv=m&mvi=4&pl=24&initcwndbps=1445000&vprv=1&mime=video%2Fmp4&ns=ZFtI1mO_pyL9MLoHvG1ZnnAG&gir=yes&clen=108691824&dur=351.766&lmt=1639887125806668&mt=1640299976&fvip=4&keepalive=yes&fexp=24001373%2C24007246&c=WEB&txp=5535434&n=RFqNZyvq5y4bvVrN&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AOq0QJ8wRgIhAMS7SZttIXB21PETKa6VWDkXZGve9iy1NTBr6Xez3NAgAiEAg8mw6_IzhwSAg4HNfutGj-9ve9jljtSVOaINe5ZPMB0%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRAIgZN3SVEpdF19hk5VqEpqdu8_KGcmmcQB4MFcmXQocLRECIDPwxKd4pkdqTe9gJBp-AQYMMtyAvac0IVMjtrUJ1RMq"
  );

  const handleURLChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value);
    },
    []
  );

  const handleSubmitURL = useCallback(async () => {
    console.log(`getting video url for: ${url}`);
    const ret = await axios.post(`http://localhost:3000/analyze`, {
      url,
    });
    console.log(ret.data.data);
    setVideoUrl(ret.data.data.urls[0]);
  }, [url]);

  const handleFilenameChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilename(e.target.value);
    },
    []
  );

  const handleClip = useCallback(async () => {
    if (filename === "") {
      // TODO: do actual validation / error handling
      return;
    }
    console.log(
      `clipping video: ${videoUrl}, from ${startEndTimes[0]} to ${startEndTimes[1]}`,
      `filename: ${filename}`
    );
    const ret = await axios.post(`http://localhost:3000/clips`, {
      url: videoUrl,
      start: startEndTimes[0] * 1000, // TODO: * 1000 is a hack, fix me!
      end: startEndTimes[1] * 1000, // TODO: * 1000 is a hack, fix me!
      output: filename,
    });
    console.log("response:", ret.data);
  }, [videoUrl, startEndTimes, filename]);

  return (
    <>
      <Video
        src={videoUrl}
        startEndTimes={startEndTimes}
        onUpdateStartEndTimes={setStartEndTimes}
      />

      <Grid container={true} spacing={2} pb={1} alignItems="center">
        <Grid item={true} xs={10}>
          <TextField
            fullWidth={true}
            value={url}
            variant="outlined"
            label="Video URL"
            onChange={handleURLChange}
          />
        </Grid>
        <Grid item={true} xs={2}>
          <Button variant="contained" onClick={handleSubmitURL}>
            Submit
          </Button>
        </Grid>
      </Grid>

      <Grid container={true} spacing={2} pb={1} alignItems="center">
        <Grid item={true} xs={10}>
          <TextField
            fullWidth={true}
            value={filename}
            variant="outlined"
            label="Clip filename"
            onChange={handleFilenameChange}
          />
        </Grid>
        <Grid item={true} xs={2}>
          <Button variant="contained" onClick={handleClip}>
            Clip
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
