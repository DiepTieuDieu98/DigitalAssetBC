import { AbstractFormGroupDirective } from '@angular/forms';

export class MusicItem {
    id: String;
    name: String;
    title: String;
    album: String;
    publishingYear: String;
    ownerId: Number;
    licenceId: Number;
    creatureType: String;
    lyricsCheck: boolean;
    audioCheck: boolean;
    mvCheck: boolean;
    ownerType: String;

    transactionHash: String;
    contractAddress: String;
    transactionStatus: String;

    dateCreated: String;
}
