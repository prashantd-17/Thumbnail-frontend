import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-thumbnail',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './thumbnail.component.html',
  styleUrl: './thumbnail.component.scss'
})
export class ThumbnailComponent implements OnInit {
youtubeUrl = '';
  thumbnails: any = null;
  thumbnailKeys: string[] = [];
  plans:any[] = ['Full HD', 'Medium', 'Standard']
  showError:boolean = false;

  constructor(private http: HttpClient, private title : Title) {}
  ngOnInit(): void {
    this.title.setTitle('YouTube Thumbnail Downloader | Free HD Thumbnails');
  }

  getThumbnail() {
    if (!this.youtubeUrl.trim()) return;
    this.showError = false
    this.http.post('https://thumbnail-backend-g1bn.onrender.com/api/get-thumbnail', { url: this.youtubeUrl })
      .subscribe({
        next: (res: any) => {
          this.showError = false
          this.thumbnails = res.thumbnails;
          this.thumbnailKeys = Object.keys(this.thumbnails);

        },
        error: (err:any) => {
          // alert(err.error?.error || 'Something went wrong!');
          if(err.error?.error ){
            this.showError = true
          }
        }
      });
  }

  downloadThumbnail(url: string, name: string) {
  this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = `${name}.jpg`;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }, error => {
    alert('Failed to download image');
  });
}

}
