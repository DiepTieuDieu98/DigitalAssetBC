﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicServer.Models.Database
{
    public class OwnerPrivateKeyInfo
    {
        public int UserID { get; set; }
        public string OwnerPrivateKey { get; set; }
    }
}